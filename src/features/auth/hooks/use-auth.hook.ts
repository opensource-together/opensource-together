import { useQuery, useQueryClient } from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

import { useToastMutation } from "@/shared/hooks/use-toast-mutation";

import {
  getCurrentUser,
  logout,
  signInWithProvider,
} from "../services/auth.service";

export default function useAuth() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const pathname = usePathname();

  const {
    data: currentUser,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["users", "me"],
    queryFn: getCurrentUser,
    retry: 0,
  });

  useEffect(() => {
    if (isLoading || !currentUser) return;

    const isOnboardingCompleted =
      !!currentUser.jobTitle || (currentUser.userTechStacks?.length ?? 0) > 0;

    const isOnboarding = pathname?.startsWith("/onboarding");
    const isAuth = pathname?.startsWith("/auth");

    if (!isOnboardingCompleted && !isOnboarding && !isAuth) {
      router.push("/onboarding");
    }
  }, [currentUser, isLoading, pathname, router]);

  const signInMutation = useToastMutation<unknown, Error, string>({
    mutationFn: async (provider) => await signInWithProvider(provider),
    loadingMessage: "Logging in...",
    successMessage: "Logged in successfully!",
    errorMessage: "An error occurred while logging in",
  });

  const logoutMutation = useToastMutation({
    mutationFn: logout,
    loadingMessage: "Logging out...",
    successMessage: "Logged out successfully!",
    errorMessage: "An error occurred while logging out",
    options: {
      onSuccess: () => {
        queryClient.setQueryData(["users", "me"], null);
        router.push("/");
      },
    },
  });

  return {
    currentUser,
    isAuthenticated: !!currentUser,
    isLoading,
    isError,

    signInWithProvider: signInMutation.mutate,
    logout: logoutMutation.mutate,

    isSigningIn: signInMutation.isPending,
    isLoggingOut: logoutMutation.isPending,
  };
}
