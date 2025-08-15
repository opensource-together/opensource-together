import { useQuery, useQueryClient } from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

import { useToastMutation } from "@/shared/hooks/use-toast-mutation";

import {
  getCurrentUser,
  getGitHubAuthUrl,
  getGoogleAuthUrl,
  handleGitHubCallback,
  handleGoogleCallback,
  logout,
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

        const redirectUrl = sessionStorage.getItem("auth_redirect_url");
        sessionStorage.removeItem("auth_redirect_url");

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

        const redirectUrl = sessionStorage.getItem("auth_redirect_url");
        sessionStorage.removeItem("auth_redirect_url");

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

    signInWithGitHub: githubSignInMutation.mutate,
    signInWithGoogle: googleSignInMutation.mutate,
    redirectAfterGitHub: githubCallbackMutation.mutate,
    redirectAfterGoogle: googleCallbackMutation.mutate,
    logout: logoutMutation.mutate,
    redirectToLogin,
    requireAuth,

    isSigningIn: githubSignInMutation.isPending,
    isProcessingCallback: githubCallbackMutation.isPending,
    isLoggingOut: logoutMutation.isPending,
  };
}
