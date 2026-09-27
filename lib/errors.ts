/** Enterprise error hierarchy with safe HTTP serialization. */

export type ErrorCode =
  | "VALIDATION_ERROR"
  | "AUTH_ERROR"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "RATE_LIMITED"
  | "PAYMENT_ERROR"
  | "DATABASE_ERROR"
  | "UPSTREAM_ERROR"
  | "INTERNAL_ERROR";

export class AppError extends Error {
  readonly code: ErrorCode;
  readonly status: number;
  readonly expose: boolean;
  readonly details?: unknown;

  constructor(code: ErrorCode, message: string, status: number, options?: { expose?: boolean; details?: unknown; cause?: unknown }) {
    super(message, { cause: options?.cause });
    this.name = new.target.name;
    this.code = code;
    this.status = status;
    this.expose = options?.expose ?? status < 500;
    this.details = options?.details;
  }

  toBody(): { success: false; error: string; code: ErrorCode; details?: unknown } {
    return {
      success: false,
      error: this.expose ? this.message : "Something went wrong. Please try again.",
      code: this.code,
      ...(this.expose && this.details !== undefined ? { details: this.details } : {}),
    };
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: unknown) {
    super("VALIDATION_ERROR", message, 422, { details });
  }
}

export class AuthError extends AppError {
  constructor(message = "Sign in required") {
    super("AUTH_ERROR", message, 401);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = "You don't have permission for this action") {
    super("FORBIDDEN", message, 403);
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Not found") {
    super("NOT_FOUND", message, 404);
  }
}

export class RateLimitError extends AppError {
  constructor(message = "Too many requests. Try again shortly.") {
    super("RATE_LIMITED", message, 429);
  }
}

export class PaymentError extends AppError {
  constructor(message: string, options?: { cause?: unknown }) {
    super("PAYMENT_ERROR", message, 502, { expose: true, cause: options?.cause });
  }
}

export class DatabaseError extends AppError {
  constructor(message = "A storage error occurred", cause?: unknown) {
    super("DATABASE_ERROR", message, 500, { cause });
  }
}

export class UpstreamError extends AppError {
  constructor(service: string, cause?: unknown) {
    super("UPSTREAM_ERROR", `${service} is unavailable right now`, 502, { expose: true, cause });
  }
}

export function toAppError(error: unknown): AppError {
  if (error instanceof AppError) return error;
  const message = error instanceof Error ? error.message : "Unknown error";
  return new AppError("INTERNAL_ERROR", message, 500, { cause: error });
}
