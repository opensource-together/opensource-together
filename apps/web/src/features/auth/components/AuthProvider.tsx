"use client";

import { createContext, useContext, useEffect, ReactNode } from "react";
import { useUserStore } from "@/stores/userStore";

interface AuthContextType {
  isLoading: boolean;
  isAuthenticated: boolean;
  user: any;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { user, isAuthenticated, isLoading, logout, hydrate } = useUserStore();

  useEffect(() => {
    // Hydrate le store au montage du composant
    hydrate();
  }, [hydrate]);

  const value: AuthContextType = {
    isLoading,
    isAuthenticated,
    user,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
} 