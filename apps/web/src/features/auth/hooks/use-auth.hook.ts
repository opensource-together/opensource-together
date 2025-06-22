import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { useToastMutation } from "@/shared/hooks/use-toast-mutation";

import {
  getCurrentUser,
  getGitHubAuthUrl,
  handleGitHubCallback,
  logout,
} from "../services/auth.service";

/**
 * Custom React hook for managing user authentication state and actions.
 *
 * Provides the current user, authentication status, loading and error states, and functions for signing in with GitHub, handling the GitHub OAuth callback, and logging out. Also exposes loading states for each authentication action.
 *
 * @returns An object containing authentication data, action functions, and loading states.
 */
export default function useAuth() {
  const router = useRouter();
  const queryClient = useQueryClient();

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
        router.push("/profile");
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

    // Loading states
    isSigningIn: githubSignInMutation.isPending,
    isProcessingCallback: githubCallbackMutation.isPending,
    isLoggingOut: logoutMutation.isPending,
  };
}
