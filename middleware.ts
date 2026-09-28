import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const hostname = req.headers.get("host") || "";

  // Check if accessing via admin subdomain or alias
  // Supports: admin.yourdomain.com, admin-*, *-admin.vercel.app
  const isAdminSubdomain =
    hostname.startsWith("admin.") ||
    hostname.startsWith("admin-") ||
    hostname.includes("-admin.") ||
    hostname.startsWith("vasavievents-admin");

  if (isAdminSubdomain) {
    // If user is at root of admin subdomain, rewrite to /admin
    if (url.pathname === "/") {
      return NextResponse.rewrite(new URL("/admin", req.url));
    }
    // If not already prefixed with /admin and not an internal asset, rewrite
    if (
      !url.pathname.startsWith("/admin") &&
      !url.pathname.startsWith("/api") &&
      !url.pathname.startsWith("/_next") &&
      !url.pathname.includes(".")
    ) {
      return NextResponse.rewrite(new URL(`/admin${url.pathname}`, req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
