import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { useUserStore } from "@/stores/userStore";

import { useToastMutation } from "@/hooks/useToastMutation";

import { getGitHubAuthUrl, handleGitHubCallback } from "../services/authApi";

export default function useAuth() {
  const router = useRouter();
  const { checkSession } = useUserStore();

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
    mutationFn: async () => {
      await handleGitHubCallback();
      await checkSession();
    },
    loadingMessage: "Vérification de vos informations GitHub...",
    successMessage: "Connexion réussie !",
    errorMessage: "Une erreur est survenue lors de la connexion",
    options: {
      onSuccess: () => {
        toast.dismiss();
        const urlParams = new URLSearchParams(window.location.search);
        const redirectTo = urlParams.get("redirectTo");
        router.push(redirectTo || "/profile");
      },
      onError: async () => router.push("/auth/login"),
    },
  });

  return {
    signInWithGitHub: githubSignInMutation.mutate,
    redirectAfterGitHub: githubCallbackMutation.mutate,
    isLoading:
      githubSignInMutation.isPending || githubCallbackMutation.isPending,
  };
}
