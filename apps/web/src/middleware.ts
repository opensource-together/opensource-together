import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const protectedRoutes = ["/profile", "/projects/create", "/dashboard"];
const authRoutes = ["/auth/login", "/auth/register"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check presence of SuperTokens session cookies
  const hasSessionCookies =
    request.cookies.has("better-auth.session_token") ||
    request.cookies.has("better-auth.access_token") ||
    request.cookies.has("better-auth.refresh_token");

  // If the user is authenticated and tries to access auth routes
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  if (isAuthRoute && hasSessionCookies)
    return NextResponse.redirect(new URL("/", request.url));

  // Check if the route requires authentication
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (!isProtectedRoute) return NextResponse.next();

  // For protected routes, check the session
  if (!hasSessionCookies) return redirectToLogin(request);

  // If the cookies exist, let them pass (the fine check is done on the client side)
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
