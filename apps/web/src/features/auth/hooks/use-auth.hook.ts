import { useQuery, useQueryClient } from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";

import { useToastMutation } from "@/shared/hooks/use-toast-mutation";

import {
  getCurrentUser,
  getGitHubAuthUrl,
  handleGitHubCallback,
  logout,
} from "../services/auth.service";

export default function useAuth() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const pathname = usePathname();

  // Query to get the current user
  const {
    data: currentUser,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["user/me"],
    queryFn: getCurrentUser,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false,
  });

  const githubSignInMutation = useToastMutation({
    mutationFn: async () => {
      const authUrl = await getGitHubAuthUrl();
      window.location.assign(authUrl);
      return authUrl;
    },
    loadingMessage: "Redirection vers GitHub...",
    successMessage: "Redirection en cours...",
    errorMessage: "Erreur lors de la redirection vers GitHub",
  });

  const githubCallbackMutation = useToastMutation({
    mutationFn: handleGitHubCallback,
    loadingMessage: "Vérification de vos informations GitHub...",
    successMessage: "Connexion réussie !",
    errorMessage: "Une erreur est survenue lors de la connexion",
    options: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["user/me"] });

        // Récupérer l'URL de redirection depuis le sessionStorage
        const redirectUrl = sessionStorage.getItem("auth_redirect_url");
        sessionStorage.removeItem("auth_redirect_url"); // Nettoyer après utilisation

        // Rediriger vers l'URL d'origine ou vers /profile par défaut
        router.push(redirectUrl || "/profile");
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

    // Actions
    signInWithGitHub: githubSignInMutation.mutate,
    redirectAfterGitHub: githubCallbackMutation.mutate,
    logout: logoutMutation.mutate,
    redirectToLogin, // Fonction helper pour redirection manuelle
    requireAuth, // Fonction helper pour actions protégées

    // Loading states
    isSigningIn: githubSignInMutation.isPending,
    isProcessingCallback: githubCallbackMutation.isPending,
    isLoggingOut: logoutMutation.isPending,
  };
}
