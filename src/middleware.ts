import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const protectedRoutes = [
  "/profile/me",
  "/projects/create",
  "/projects/:id/edit",
  "/onboarding",
  "/dashboard",
];
const authRoutes = ["/auth/login"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const hasBetterAuthCookie = request.cookies
    .getAll()
    .some(
      (cookie) =>
        cookie.name.startsWith("better-auth.session") ||
        cookie.name.startsWith("__Secure-better-auth.session_token")
    );

  const hasSessionCookies = hasBetterAuthCookie;

  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  if (isAuthRoute && hasSessionCookies)
    return NextResponse.redirect(new URL("/", request.url));

  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (!isProtectedRoute) return NextResponse.next();

  if (!hasSessionCookies) return redirectToLogin(request);

  return NextResponse.next();
}

function redirectToLogin(request: NextRequest) {
  const loginUrl = new URL("/auth/login", request.url);
  loginUrl.searchParams.set("redirectTo", request.nextUrl.href);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
