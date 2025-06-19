"use client";

import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";

import { useAuth } from "./AuthProvider";

interface ProtectedRouteProps {
  children: ReactNode;
  fallback?: ReactNode;
  redirectTo?: string;
}

export function ProtectedRoute({
  children,
  fallback,
  redirectTo = "/auth/login",
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      const currentPath = window.location.pathname;
      const loginUrl = `${redirectTo}?redirectTo=${encodeURIComponent(currentPath)}`;
      router.push(loginUrl);
    }
  }, [isAuthenticated, isLoading, router, redirectTo]);

  if (isLoading) {
    return (
      fallback || (
        <div className="flex min-h-screen items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-gray-900"></div>
        </div>
      )
    );
  }

  if (!isAuthenticated) {
    return null; // Le useEffect va gérer la redirection
  }

  return <>{children}</>;
}

interface PublicRouteProps {
  children: ReactNode;
  redirectTo?: string;
}

export function PublicRoute({ children, redirectTo = "/" }: PublicRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push(redirectTo);
    }
  }, [isAuthenticated, isLoading, router, redirectTo]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    return null; // Le useEffect va gérer la redirection
  }

  return <>{children}</>;
}
