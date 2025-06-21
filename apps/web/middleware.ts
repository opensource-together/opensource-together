import { NextRequest, NextResponse } from "next/server";

// Routes qui nécessitent une authentification
const protectedRoutes = [
  "/profile",
  "/projects/new",
  "/projects/*/edit",
  "/dashboard",
];

// Routes publiques (accessibles sans authentification)
const publicRoutes = [
  "/",
  "/auth/login",
  "/auth/signup",
  "/auth/callback/github",
  "/projects", // Liste publique des projets
  "/guides",
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Vérifier si la route est protégée
  const isProtectedRoute = protectedRoutes.some((route) => {
    if (route.includes("*")) {
      const pattern = route.replace("*", "[^/]+");
      return new RegExp(`^${pattern}$`).test(pathname);
    }
    return pathname.startsWith(route);
  });

  // Vérifier si la route est publique
  const isPublicRoute = publicRoutes.some((route) => {
    return pathname === route || pathname.startsWith(route);
  });

  // Si c'est une route protégée, vérifier l'authentification via cookie
  if (isProtectedRoute) {
    const sessionCookie = request.cookies.get("sAccessToken");

    if (!sessionCookie) {
      // Rediriger vers la page de connexion
      const loginUrl = new URL("/auth/login", request.url);
      loginUrl.searchParams.set("redirectTo", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Si l'utilisateur est connecté et essaie d'accéder aux pages d'auth
  if (pathname.startsWith("/auth/") && !pathname.includes("/callback")) {
    const sessionCookie = request.cookies.get("sAccessToken");

    if (sessionCookie) {
      // Rediriger vers la page d'accueil si déjà connecté
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
