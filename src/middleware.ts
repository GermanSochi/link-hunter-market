import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Edge-compatible auth — uses JWT only, no Prisma
const { auth } = NextAuth(authConfig);

// In-memory rate limit (per-instance, resets on cold start — OK for edge)
const ipHits = new Map<string, { count: number; resetAt: number }>();

function getIp(req: NextRequest): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}

function rateLimit(key: string, max: number, windowMs: number): boolean {
  const now = Date.now();
  const entry = ipHits.get(key);
  if (!entry || now > entry.resetAt) {
    ipHits.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  entry.count += 1;
  return entry.count <= max;
}

function addSecurityHeaders(res: NextResponse): NextResponse {
  res.headers.set("X-Frame-Options", "SAMEORIGIN");
  res.headers.set("X-Content-Type-Options", "nosniff");
  res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  res.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  res.headers.set(
    "Content-Security-Policy",
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' telegram.org",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: blob: https:",
      "connect-src 'self' wss: ws:",
      "frame-src 'self' telegram.org",
    ].join("; ")
  );
  return res;
}

export default auth((req) => {
  const path = req.nextUrl.pathname;
  const ip = getIp(req as unknown as NextRequest);
  const isLoggedIn = !!req.auth;

  // Bot detection
  const ua = req.headers.get("user-agent") ?? "";
  if (
    ua === "" ||
    /sqlmap|nikto|nmap|masscan|zgrab|nuclei|python-requests\//.test(ua.toLowerCase())
  ) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  // Rate limiting: auth (session/csrf/callback excluded)
  const isSessionOrCsrf =
    path === "/api/auth/session" ||
    path === "/api/auth/csrf" ||
    path.startsWith("/api/auth/callback/");
  if (!isSessionOrCsrf && (path.startsWith("/api/auth") || path.startsWith("/api/trpc/auth"))) {
    if (!rateLimit(`auth:${ip}`, 30, 60_000)) {
      return new NextResponse("Too Many Requests", {
        status: 429,
        headers: { "Retry-After": "60" },
      });
    }
  }

  // Rate limiting: API
  if (path.startsWith("/api/") && !path.startsWith("/api/auth")) {
    if (!rateLimit(`api:${ip}`, 120, 60_000)) {
      return new NextResponse("Too Many Requests", {
        status: 429,
        headers: { "Retry-After": "60" },
      });
    }
  }

  // Redirect logged-in users away from auth pages
  if ((path === "/sign-in" || path === "/sign-up") && isLoggedIn) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // Protect account/dashboard/admin routes
  if (
    (path.startsWith("/dashboard") || path.startsWith("/account") || path.startsWith("/admin")) &&
    !isLoggedIn
  ) {
    const callbackUrl = encodeURIComponent(path);
    return NextResponse.redirect(new URL(`/sign-in?callbackUrl=${callbackUrl}`, req.url));
  }

  const res = NextResponse.next();
  return addSecurityHeaders(res);
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|public/).*)" ],
};
