import { NextResponse, type NextRequest } from "next/server";

const isDev = process.env.NODE_ENV === "development";

const cspDirectives: Record<string, string[]> = {
  "default-src": ["'self'"],
  "script-src": [
    "'self'",
    "'unsafe-inline'", // required by GTM/GA/Meta Pixel inline bootstraps
    ...(isDev ? ["'unsafe-eval'"] : []),
    "https://www.googletagmanager.com",
    "https://www.google-analytics.com",
    "https://connect.facebook.net",
    "https://checkout.razorpay.com",
    "https://sdk.cashfree.com",
    "https://browser.sentry-cdn.com",
  ],
  "style-src": ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
  "font-src": ["'self'", "https://fonts.gstatic.com", "data:"],
  "img-src": [
    "'self'",
    "data:",
    "blob:",
    "https://cdn.sanity.io",
    "https://*.amazonaws.com",
    "https://*.cloudfront.net",
    "https://www.google-analytics.com",
    "https://www.googletagmanager.com",
    "https://www.facebook.com",
  ],
  "connect-src": [
    "'self'",
    process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL ?? "http://localhost:9000",
    "https://*.sanity.io",
    "https://www.google-analytics.com",
    "https://*.google-analytics.com",
    "https://www.googletagmanager.com",
    "https://*.ingest.sentry.io",
    "https://api.razorpay.com",
    "https://lumberjack.razorpay.com",
    "https://api.cashfree.com",
    "https://sandbox.cashfree.com",
    ...(isDev ? ["ws:"] : []),
  ],
  "frame-src": [
    "'self'",
    "https://api.razorpay.com",
    "https://checkout.razorpay.com",
    "https://sdk.cashfree.com",
    "https://www.youtube-nocookie.com",
  ],
  "object-src": ["'none'"],
  "base-uri": ["'self'"],
  "form-action": ["'self'", "https://checkout.razorpay.com", "https://payments.cashfree.com"],
  "frame-ancestors": ["'none'"],
  ...(isDev ? {} : { "upgrade-insecure-requests": [] }),
};

function buildCsp(): string {
  return Object.entries(cspDirectives)
    .map(([directive, sources]) =>
      sources.length ? `${directive} ${sources.join(" ")}` : directive
    )
    .join("; ");
}

const MUTATING_METHODS = new Set(["POST", "PUT", "PATCH", "DELETE"]);

export function middleware(request: NextRequest) {
  // CSRF preparation: same-origin enforcement for mutating API requests.
  if (request.nextUrl.pathname.startsWith("/api/") && MUTATING_METHODS.has(request.method)) {
    const origin = request.headers.get("origin");
    const host = request.headers.get("host");
    if (origin && host) {
      try {
        if (new URL(origin).host !== host) {
          return NextResponse.json(
            { success: false, error: "Cross-origin request rejected" },
            { status: 403 }
          );
        }
      } catch {
        return NextResponse.json(
          { success: false, error: "Invalid origin" },
          { status: 403 }
        );
      }
    }
  }

  const response = NextResponse.next();
  response.headers.set("Content-Security-Policy", buildCsp());
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  return response;
}

export const config = {
  matcher: [
    {
      source: "/((?!_next/static|_next/image|favicon.ico|icon.svg|apple-icon.png|.*\\.(?:png|jpg|jpeg|webp|avif|svg|woff2?)$).*)",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
};
