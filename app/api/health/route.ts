import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export function GET() {
  return NextResponse.json(
    {
      status: "ok",
      service: "cefalu-web",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    },
    {
      headers: { "Cache-Control": "no-store" },
    }
  );
}
