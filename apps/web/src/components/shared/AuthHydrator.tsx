"use client";

import { useEffect } from "react";

import { useUserStore } from "@/stores/userStore";

/**
 * Component to handle auth state hydration on app startup
 * This replaces the need for AuthProvider since we're using Zustand
 */
export function AuthHydrator() {
  const { hydrate } = useUserStore();

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  return null;
}
