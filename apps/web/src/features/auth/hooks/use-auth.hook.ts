import { useQuery, useQueryClient } from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

import { useToastMutation } from "@/shared/hooks/use-toast-mutation";
import { socket } from "@/shared/realtime/socket";

import {
  getCurrentUser,
  getGitHubAuthUrl,
  getGoogleAuthUrl,
  getWebSocketToken,
  handleGitHubCallback,
  handleGoogleCallback,
  logout,
} from "../services/auth.service";

export default function useAuth() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const pathname = usePathname();

  // Gérer la sauvegarde de l'URL de redirection depuis les search params
  useEffect(() => {
    // Seulement sur les pages auth et pas sur callback GitHub
    if (
      !pathname?.startsWith("/auth") ||
      pathname?.includes("/auth/callback")
    ) {
      return;
    }

    // Utiliser window.location.search côté client pour éviter l'erreur Next.js
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const redirectUrl = urlParams.get("redirect");
      if (redirectUrl) {
        const decodedRedirectUrl = decodeURIComponent(redirectUrl);
        sessionStorage.setItem("auth_redirect_url", decodedRedirectUrl);
      }
    }
  }, [pathname]);

  // Query to get the current user
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

  const githubSignInMutation = useToastMutation({
    mutationFn: async () => {
      const authUrl = await getGitHubAuthUrl();
      window.location.assign(authUrl);
      return authUrl;
    },
    loadingMessage: "Redirection vers Github...",
    successMessage: "Redirection en cours...",
    errorMessage: "Erreur lors de la redirection vers Github",
  });

  const googleSignInMutation = useToastMutation({
    mutationFn: async () => {
      const authUrl = await getGoogleAuthUrl();
      window.location.assign(authUrl);
      return authUrl;
    },
    loadingMessage: "Redirection vers Google...",
    successMessage: "Redirection en cours...",
    errorMessage: "Erreur lors de la redirection vers Google",
  });

  const githubCallbackMutation = useToastMutation({
    mutationFn: handleGitHubCallback,
    loadingMessage: "Vérification de vos informations Github...",
    successMessage: "Connexion réussie !",
    errorMessage: "Une erreur est survenue lors de la connexion",
    options: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["user/me"] });
        queryClient.invalidateQueries({ queryKey: ["ws-token"] });

        // Récupérer l'URL de redirection depuis le sessionStorage
        const redirectUrl = sessionStorage.getItem("auth_redirect_url");
        sessionStorage.removeItem("auth_redirect_url"); // Nettoyer après utilisation

        // Rediriger vers l'URL d'origine ou vers / par défaut
        router.push(redirectUrl || "/");
      },
      onError: () => router.push("/auth/login"),
    },
  });

  const googleCallbackMutation = useToastMutation({
    mutationFn: handleGoogleCallback,
    loadingMessage: "Vérification de vos informations Google...",
    successMessage: "Connexion réussie !",
    errorMessage: "Une erreur est survenue lors de la connexion",
    options: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["user/me"] });
        queryClient.invalidateQueries({ queryKey: ["ws-token"] });

        // Récupérer l'URL de redirection depuis le sessionStorage
        const redirectUrl = sessionStorage.getItem("auth_redirect_url");
        sessionStorage.removeItem("auth_redirect_url"); // Nettoyer après utilisation

        // Rediriger vers l'URL d'origine ou vers / par défaut
        router.push(redirectUrl || "/");
      },
      onError: () => router.push("/auth/login"),
    },
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

  // Helper fonction pour rediriger vers login en sauvegardant l'URL actuelle
  const redirectToLogin = (customRedirectUrl?: string) => {
    const redirectUrl = customRedirectUrl || pathname;
    const encodedRedirectUrl = encodeURIComponent(redirectUrl);
    router.push(`/auth/login?redirect=${encodedRedirectUrl}`);
  };

  /**
   * Fonction qui vérifie l'authentification avant d'exécuter une action
   * Si l'utilisateur n'est pas connecté, redirige vers login et sauvegarde l'URL actuelle
   * Si l'utilisateur est connecté, exécute l'action
   */
  const requireAuth = (action: () => void, customRedirectUrl?: string) => {
    if (!currentUser) {
      redirectToLogin(customRedirectUrl);
      return;
    }
    action();
  };

  return {
    // Data
    currentUser,
    isAuthenticated: !!currentUser,
    isLoading,
    isError,
    wsToken,

    // Actions
    signInWithGitHub: githubSignInMutation.mutate,
    signInWithGoogle: googleSignInMutation.mutate,
    redirectAfterGitHub: githubCallbackMutation.mutate,
    redirectAfterGoogle: googleCallbackMutation.mutate,
    logout: logoutMutation.mutate,
    redirectToLogin, // Fonction helper pour redirection manuelle
    requireAuth, // Fonction helper pour actions protégées

    // Loading states
    isSigningIn: githubSignInMutation.isPending,
    isProcessingCallback: githubCallbackMutation.isPending,
    isLoggingOut: logoutMutation.isPending,
  };
}
