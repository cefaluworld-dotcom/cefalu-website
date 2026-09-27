import { NextResponse } from "next/server";
import { openApiSpec } from "@/lib/openapi";

export const dynamic = "force-static";

/** Machine-readable OpenAPI 3.1 document. */
export function GET() {
  return NextResponse.json(openApiSpec, {
    headers: { "Cache-Control": "public, max-age=3600" },
  });
}
