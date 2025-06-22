import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const protectedRoutes = ["/profile", "/projects/new", "/my-projects"];
const authRoutes = ["/auth/login", "/auth/register"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Vérifier la présence des cookies de session SuperTokens
  const hasSessionCookies =
    request.cookies.has("sFrontToken") ||
    request.cookies.has("sAccessToken") ||
    request.cookies.has("st-access-token") ||
    request.cookies.has("st-refresh-token");

  // Si l'utilisateur est connecté et tente d'accéder aux pages d'auth
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  if (isAuthRoute && hasSessionCookies)
    return NextResponse.redirect(new URL("/", request.url));

  // Vérifier si la route nécessite une authentification
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (!isProtectedRoute) return NextResponse.next();

  // Pour les routes protégées, vérifier la session
  if (!hasSessionCookies) return redirectToLogin(request);

  // Si les cookies existent, laisser passer (la vérification fine se fait côté client)
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
