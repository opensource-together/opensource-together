import { useQuery, useQueryClient } from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

import { useToastMutation } from "@/shared/hooks/use-toast-mutation";

import {
  deleteAccount,
  getCurrentUser,
  linkSocialAccount,
  logout,
  signInWithProvider,
  unlinkSocialAccount,
} from "../services/auth.service";

export default function useAuth() {
  const router = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();

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

  const linkSocialAccountMutation = useToastMutation<
    unknown,
    Error,
    string | { provider: string; callbackURL?: string }
  >({
    mutationFn: async (arg) => {
      if (typeof arg === "string") {
        return await linkSocialAccount(arg);
      }
      return await linkSocialAccount(arg.provider, arg.callbackURL);
    },
    loadingMessage: "Linking social account...",
    successMessage: "Social account linked successfully!",
    errorMessage: "An error occurred while linking social account",
    options: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["users", "me"] });
      },
    },
  });

  const unlinkSocialAccountMutation = useToastMutation<unknown, Error, string>({
    mutationFn: async (providerId) => await unlinkSocialAccount(providerId),
    loadingMessage: "Unlinking social account...",
    successMessage: "Social account unlinked successfully",
    errorMessage: "An error occurred while unlinking social account",
    options: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["users", "me"] });
      },
    },
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

  const deleteAccountMutation = useToastMutation({
    mutationFn: deleteAccount,
    loadingMessage: "Deleting account...",
    successMessage: "Your account has been deleted.",
    errorMessage: "Failed to delete your account",
    options: {
      onSuccess: () => {
        queryClient.clear();
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
    linkSocialAccount: linkSocialAccountMutation.mutate,
    unlinkSocialAccount: unlinkSocialAccountMutation.mutate,
    logout: logoutMutation.mutate,
    deleteAccount: deleteAccountMutation.mutate,

    isSigningIn: signInMutation.isPending,
    isLinkingSocialAccount: linkSocialAccountMutation.isPending,
    isUnlinkingSocialAccount: unlinkSocialAccountMutation.isPending,
    isLoggingOut: logoutMutation.isPending,
    isDeletingAccount: deleteAccountMutation.isPending,
  };
}
