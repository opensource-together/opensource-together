import { useQuery, useQueryClient } from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

import { useToastMutation } from "@/shared/hooks/use-toast-mutation";
import { socket } from "@/shared/realtime/socket";

import {
  getCurrentUser,
  getWebSocketToken,
  logout,
  signInWithProvider,
} from "../services/auth.service";

export default function useAuth() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const pathname = usePathname();

  useEffect(() => {
    if (
      !pathname?.startsWith("/auth") ||
      pathname?.includes("/auth/callback")
    ) {
      return;
    }

    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const redirectUrl = urlParams.get("redirect");
      if (redirectUrl) {
        const decodedRedirectUrl = decodeURIComponent(redirectUrl);
        sessionStorage.setItem("auth_redirect_url", decodedRedirectUrl);
      }
    }
  }, [pathname]);

  const {
    data: currentUser,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["user/me"],
    queryFn: getCurrentUser,
  });

  // Query to get the WebSocket token
  const { data: wsToken } = useQuery({
    queryKey: ["ws-token"],
    queryFn: getWebSocketToken,
    enabled: !!currentUser,
  });

  // Effect to manage the WebSocket token in the localStorage
  useEffect(() => {
    if (wsToken) {
      localStorage.setItem("wsToken", wsToken);
    } else if (!currentUser) {
      localStorage.removeItem("wsToken");
    }
  }, [wsToken, currentUser]);

  const signInMutation = useToastMutation<unknown, Error, string>({
    mutationFn: async (provider) => await signInWithProvider(provider),
    loadingMessage: "Connexion en cours...",
    successMessage: "Connexion réussie !",
    errorMessage: "Une erreur est survenue lors de la connexion",
  });

  const logoutMutation = useToastMutation({
    mutationFn: logout,
    loadingMessage: "Déconnexion en cours...",
    successMessage: "Déconnexion réussie !",
    errorMessage: "Erreur lors de la déconnexion",
    options: {
      onSuccess: () => {
        queryClient.setQueryData(["user/me"], null);
        queryClient.setQueryData(["ws-token"], null);
        localStorage.removeItem("wsToken");
        socket.disconnect();
        router.push("/");
      },
    },
  });

  const redirectToLogin = (customRedirectUrl?: string) => {
    const redirectUrl = customRedirectUrl || pathname;
    const encodedRedirectUrl = encodeURIComponent(redirectUrl);
    router.push(`/auth/login?redirect=${encodedRedirectUrl}`);
  };

  const requireAuth = (action: () => void, customRedirectUrl?: string) => {
    if (!currentUser) {
      redirectToLogin(customRedirectUrl);
      return;
    }
    action();
  };

  return {
    currentUser,
    isAuthenticated: !!currentUser,
    isLoading,
    isError,
    wsToken,

    signInWithProvider: signInMutation.mutate,
    logout: logoutMutation.mutate,
    redirectToLogin,
    requireAuth,

    isSigningIn: signInMutation.isPending,
    isLoggingOut: logoutMutation.isPending,
  };
}
