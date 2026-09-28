import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const hostname = req.headers.get("host") || "";

  // Check if accessing via admin subdomain or alias
  const isAdminSubdomain =
    hostname.startsWith("admin.") ||
    hostname.startsWith("admin-") ||
    hostname.includes("-admin.") ||
    hostname.startsWith("vasavievents-admin");

  // Auth detection: session cookie or Supabase auth token cookie
  const sessionCookie = req.cookies.get("vasavi_admin_session")?.value;
  const hasSbAuthToken = req.cookies
    .getAll()
    .some((c) => c.name.startsWith("sb-") && c.name.endsWith("-auth-token"));
  const isAuthenticated = Boolean(sessionCookie === "active" || hasSbAuthToken);

  const isAuthPage =
    url.pathname === "/admin/login" ||
    url.pathname === "/admin/forgot-password" ||
    url.pathname.startsWith("/api/auth");

  if (isAdminSubdomain) {
    // If accessing root of admin domain:
    if (url.pathname === "/") {
      if (!isAuthenticated) {
        return NextResponse.redirect(new URL("/admin/login", req.url));
      }
      return NextResponse.rewrite(new URL("/admin", req.url));
    }

    // If accessing admin pages while unauthenticated:
    if (!isAuthPage && !isAuthenticated) {
      if (
        !url.pathname.startsWith("/api") &&
        !url.pathname.startsWith("/_next") &&
        !url.pathname.includes(".")
      ) {
        return NextResponse.redirect(new URL("/admin/login", req.url));
      }
    }

    // Rewrite clean paths if already authenticated
    if (
      !url.pathname.startsWith("/admin") &&
      !url.pathname.startsWith("/api") &&
      !url.pathname.startsWith("/_next") &&
      !url.pathname.includes(".")
    ) {
      return NextResponse.rewrite(new URL(`/admin${url.pathname}`, req.url));
    }
  } else {
    // On primary domain: if someone manually navigates to /admin without auth
    if (
      url.pathname.startsWith("/admin") &&
      !isAuthPage &&
      !isAuthenticated
    ) {
      return NextResponse.redirect(new URL("/admin/login", req.url));
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
