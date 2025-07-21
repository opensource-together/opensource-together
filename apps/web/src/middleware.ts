import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const protectedRoutes = ["/profile", "/projects/create", "/my-projects"];
const authRoutes = ["/auth/login", "/auth/register"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Redirection des anciennes URLs vers les nouvelles
  if (pathname.startsWith("/projects/") && !pathname.startsWith("/projects/create")) {
    const projectId = pathname.split("/projects/")[1];
    
    // Si c'est un UUID (format: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx)
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (uuidRegex.test(projectId)) {
      // Pour l'instant, on redirige vers la page d'accueil
      // Dans un cas réel, on devrait faire une requête API pour obtenir le slug
      return NextResponse.redirect(new URL("/", request.url));
    }
  }
  
  // Check presence of SuperTokens session cookies
  const hasSessionCookies =
    request.cookies.has("sFrontToken") ||
    request.cookies.has("sAccessToken") ||
    request.cookies.has("st-access-token") ||
    request.cookies.has("st-refresh-token");

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
