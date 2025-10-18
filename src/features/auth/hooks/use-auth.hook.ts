import { useQuery, useQueryClient } from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";

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
  });

  useEffect(() => {
    if (isLoading || !currentUser) return;

    const titleEmpty = !currentUser.jobTitle;
    const techsEmpty = !currentUser.userTechStacks?.length;

    const categoriesEmpty = true;

    const isIncomplete = titleEmpty && techsEmpty && categoriesEmpty;

    const isOnboarding = pathname?.startsWith("/onboarding");
    const isAuth = pathname?.startsWith("/auth");

    if (isIncomplete && !isOnboarding && !isAuth) {
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

/**
 * Gate access to the onboarding page without requiring useEffect in the view.
 * Redirects to home when the profile is not fully empty, and returns whether
 * the onboarding content should render.
 */
export function useOnboardingGate() {
  const { currentUser, isLoading } = useAuth();
  const router = useRouter();

  const isIncomplete = useMemo(() => {
    if (!currentUser) return false;
    const titleEmpty = !currentUser.jobTitle;
    const techsEmpty = !currentUser.userTechStacks?.length;

    const categoriesEmpty = true;
    return titleEmpty && techsEmpty && categoriesEmpty;
  }, [currentUser]);

  useEffect(() => {
    if (isLoading || !currentUser) return;
    if (!isIncomplete) {
      window.location.replace("/");
    }
  }, [currentUser, isLoading, isIncomplete, router]);

  return { canRender: !isLoading && !!currentUser && isIncomplete };
}
