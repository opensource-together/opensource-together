"use client";

import { Suspense } from "react";

import useAuthRedirect from "../hooks/use-auth-redirect.hook";

function AuthRedirectContent() {
  useAuthRedirect();
  return null;
}

/**
 * Composant qui gère la redirection depuis les search params
 * Isolé avec son propre Suspense pour éviter les erreurs SSR
 */
export default function AuthRedirectHandler() {
  return (
    <Suspense fallback={null}>
      <AuthRedirectContent />
    </Suspense>
  );
}
