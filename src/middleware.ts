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
const onboardingRoutePrefix = "/onboarding";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;

export async function middleware(request: NextRequest) {
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

  const isOnboardingRoute = pathname.startsWith(onboardingRoutePrefix);

  if (
    hasSessionCookies &&
    !isAuthRoute &&
    !isOnboardingRoute &&
    !pathname.startsWith("/api")
  ) {
    const isOnboardingCompleted = await checkOnboardingCompleted(request);
    if (!isOnboardingCompleted) {
      return NextResponse.redirect(new URL("/onboarding", request.url));
    }
  }

  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (!isProtectedRoute) return NextResponse.next();

  if (!hasSessionCookies) return redirectToLogin(request);

  if (!isOnboardingRoute) {
    const isOnboardingCompleted = await checkOnboardingCompleted(request);
    if (!isOnboardingCompleted) {
      return NextResponse.redirect(new URL("/onboarding", request.url));
    }
    return NextResponse.next();
  }

  const isOnboardingCompleted = await checkOnboardingCompleted(request);
  if (isOnboardingCompleted) {
    return NextResponse.redirect(new URL("/", request.url));
  }

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

async function checkOnboardingCompleted(
  request: NextRequest
): Promise<boolean> {
  if (!apiBaseUrl) {
    return true;
  }

  try {
    const response = await fetch(`${apiBaseUrl}/users/me`, {
      headers: {
        accept: "application/json",
        cookie: request.headers.get("cookie") ?? "",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      return true;
    }

    const data = await response.json();
    const user = data?.data;
    if (!user) {
      return true;
    }

    const hasJobTitle = Boolean(user.jobTitle);
    const hasTechStacks =
      Array.isArray(user.userTechStacks) && user.userTechStacks.length > 0;

    return hasJobTitle || hasTechStacks;
  } catch {
    return true;
  }
}
