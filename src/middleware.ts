import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const protectedRoutes: (string | RegExp)[] = [
  "/profile/me",
  "/projects/create",
  /^\/projects\/[^/]+\/edit(?:\/.*)?$/, // /projects/:id/edit
  "/onboarding",
  "/dashboard",
];

const authRoutes = ["/auth/login"];

function matches(route: string | RegExp, pathname: string) {
  return typeof route === "string"
    ? pathname.startsWith(route)
    : route.test(pathname);
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const hasSessionCookies = request.cookies
    .getAll()
    .some(
      (cookie) =>
        cookie.name.startsWith("better-auth.session") ||
        cookie.name.startsWith("__Secure-better-auth.session_token")
    );

  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));
  if (isAuthRoute && hasSessionCookies) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  const isProtectedRoute = protectedRoutes.some((route) =>
    matches(route, pathname)
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
    // Skip API routes, static assets, image optimizer, metadata routes and
    // sitemap/robots: middleware would only add CPU to requests that never
    // need an auth check.
    "/((?!api|_next/static|_next/image|favicon.ico|robots\\.txt|sitemap\\.xml|manifest\\.webmanifest|opengraph-image|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|txt|xml)$).*)",
  ],
};
