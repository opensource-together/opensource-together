import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { useToastMutation } from "@/shared/hooks/use-toast-mutation";

import {
  getCurrentUser,
  logout,
  signInWithProvider,
} from "@/features/auth/services/auth.service";

/**
 * Custom hook for authentication operations with integrated toast notifications
 */
export default function useAuth() {
  const queryClient = useQueryClient();
  const router = useRouter();

  const {
    data: currentUser,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["user/me"],
    queryFn: getCurrentUser,
  });

  const signInWithGitHubMutation = useToastMutation({
    mutationFn: () => signInWithProvider("github"),
    loadingMessage: "Connexion avec GitHub...",
    successMessage: "Redirection vers GitHub...",
    errorMessage: "Erreur lors de la connexion avec GitHub",
    options: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["user/me"] });
        router.push("/");
      },
    },
  });

  const signInWithGoogleMutation = useToastMutation({
    mutationFn: () => signInWithProvider("google"),
    loadingMessage: "Connexion avec Google...",
    successMessage: "Redirection vers Google...",
    errorMessage: "Erreur lors de la connexion avec Google",
    options: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["user/me"] });
        router.push("/");
      },
    },
  });

  const logoutMutation = useToastMutation({
    mutationFn: logout,
    loadingMessage: "Déconnexion...",
    successMessage: "Déconnexion réussie",
    errorMessage: "Erreur lors de la déconnexion",
    options: {
      onSuccess: () => {
        queryClient.setQueryData(["user/me"], null);
        router.push("/");
      },
    },
  });

  return {
    // Query states
    currentUser,
    isLoading,
    isError,

    // Mutation states
    signInWithGitHub: signInWithGitHubMutation.mutate,
    signInWithGoogle: signInWithGoogleMutation.mutate,
    logout: logoutMutation.mutate,

    // Loading states
    isSigningInWithGitHub: signInWithGitHubMutation.isPending,
    isSigningInWithGoogle: signInWithGoogleMutation.isPending,
    isLoggingOut: logoutMutation.isPending,
  };
}
