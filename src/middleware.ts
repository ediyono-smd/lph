import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifySessionToken, SESSION_COOKIE_NAME } from "@/lib/auth/session";
import { getDefaultDashboardRoute } from "@/lib/permissions/rbac";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Static and internal routes pass through
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/static") ||
    pathname.includes(".") // favicon, images, css
  ) {
    return NextResponse.next();
  }

  // 2. Read session cookie
  const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const session = sessionCookie ? await verifySessionToken(sessionCookie) : null;

  const isAuthPage =
    pathname === "/login" ||
    pathname === "/register" ||
    pathname === "/forgot-password" ||
    pathname === "/reset-password";

  // 3. If logged in and visiting Auth pages -> redirect to corresponding dashboard
  if (isAuthPage && session) {
    const redirectUrl = new URL(
      getDefaultDashboardRoute(session.activeRole),
      request.url
    );
    return NextResponse.redirect(redirectUrl);
  }

  // 4. Protected area definitions
  const isDashboardRoute = pathname.startsWith("/dashboard");
  const isAdminRoute = pathname.startsWith("/admin");
  const isMentorRoute = pathname.startsWith("/mentor");
  const isAuditorRoute = pathname.startsWith("/auditor");

  const isProtectedArea =
    isDashboardRoute || isAdminRoute || isMentorRoute || isAuditorRoute;

  // 5. If unauthenticated user tries to access protected area -> redirect to /login
  if (isProtectedArea && !session) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 6. Role based route protection
  if (session) {
    const roles = session.roles || [];
    const isSuperAdmin = roles.includes("SUPER_ADMIN");

    if (isAdminRoute && !isSuperAdmin) {
      const allowed = ["ADMIN", "VERIFIER", "LEADER"].some((r) =>
        roles.includes(r as any)
      );
      if (!allowed) {
        return NextResponse.redirect(
          new URL(getDefaultDashboardRoute(session.activeRole), request.url)
        );
      }
    }

    if (isMentorRoute && !isSuperAdmin && !roles.includes("MENTOR")) {
      return NextResponse.redirect(
        new URL(getDefaultDashboardRoute(session.activeRole), request.url)
      );
    }

    if (isAuditorRoute && !isSuperAdmin && !roles.includes("AUDITOR")) {
      return NextResponse.redirect(
        new URL(getDefaultDashboardRoute(session.activeRole), request.url)
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|images).*)",
  ],
};
