import "server-only";
import { NextResponse, type NextRequest } from "next/server";
import type { z } from "zod";
import { RateLimitError, ValidationError, toAppError } from "@/lib/errors";
import { logRequest, logger } from "@/lib/logger";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { requireRole, type Actor, type Role } from "@/lib/auth-guard";

const limiter = rateLimit({ interval: 60 * 1000, uniqueTokenPerInterval: 1000 });

export interface ApiContext<TBody, TQuery> {
  request: NextRequest;
  body: TBody;
  query: TQuery;
  ip: string;
  actor: Actor | null;
  params: Record<string, string>;
}

interface ApiOptions<TBody, TQuery> {
  bodySchema?: z.ZodType<TBody, z.ZodTypeDef, unknown>;
  querySchema?: z.ZodType<TQuery, z.ZodTypeDef, unknown>;
  /** requests per minute per IP for this route (default 30) */
  limit?: number;
  /** minimum role; when set, unauthenticated requests get 401 */
  role?: Role;
  /** route name used in rate-limit bucketing + logs */
  name: string;
}

/**
 * Enterprise route wrapper: rate limiting, zod validation (body + query),
 * role guard, unified error mapping and structured request logs.
 */
export function withApi<TBody = unknown, TQuery = unknown>(
  options: ApiOptions<TBody, TQuery>,
  handler: (ctx: ApiContext<TBody, TQuery>) => Promise<NextResponse>
) {
  return async (
    request: NextRequest,
    routeCtx: { params: Promise<Record<string, string>> }
  ): Promise<NextResponse> => {
    const started = Date.now();
    const ip = getClientIp(request.headers);
    let status = 500;
    let actor: Actor | null = null;

    try {
      if (!limiter.check(options.limit ?? 30, `${options.name}:${ip}`).success) {
        throw new RateLimitError();
      }

      if (options.role) actor = await requireRole(options.role);

      let body = undefined as TBody;
      if (options.bodySchema) {
        let raw: unknown;
        try {
          raw = await request.json();
        } catch {
          throw new ValidationError("Request body must be valid JSON");
        }
        const parsed = options.bodySchema.safeParse(raw);
        if (!parsed.success) {
          throw new ValidationError(
            parsed.error.issues[0]?.message ?? "Invalid input",
            parsed.error.flatten().fieldErrors
          );
        }
        body = parsed.data;
      }

      let query = undefined as TQuery;
      if (options.querySchema) {
        const raw = Object.fromEntries(request.nextUrl.searchParams.entries());
        const parsed = options.querySchema.safeParse(raw);
        if (!parsed.success) {
          throw new ValidationError(parsed.error.issues[0]?.message ?? "Invalid query");
        }
        query = parsed.data;
      }

      const params = routeCtx?.params ? await routeCtx.params : {};
      const response = await handler({ request, body, query, ip, actor, params });
      status = response.status;
      return response;
    } catch (error) {
      const appError = toAppError(error);
      status = appError.status;
      if (appError.status >= 500) {
        logger.error(`[${options.name}]`, { message: appError.message, cause: String(appError.cause ?? "") });
      }
      return NextResponse.json(appError.toBody(), { status: appError.status });
    } finally {
      logRequest({
        method: request.method,
        path: request.nextUrl.pathname,
        status,
        durationMs: Date.now() - started,
        ip,
        userId: actor?.id,
      });
    }
  };
}

export function ok<T extends Record<string, unknown>>(data: T, init?: ResponseInit): NextResponse {
  return NextResponse.json({ success: true, ...data }, init);
}
