import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

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
    queryKey: ["user", "me"],
    queryFn: getCurrentUser,
    retry: 0,
  });

  useEffect(() => {
    if (isLoading || !currentUser) return;

    const isOnboardingCompleted =
      !!currentUser.jobTitle ||
      (currentUser.userTechStacks?.length ?? 0) > 0 ||
      (currentUser.userCategories?.length ?? 0) > 0;

    const isOnboarding = pathname?.startsWith("/onboarding");
    const isAuth = pathname?.startsWith("/auth");

    if (!isOnboardingCompleted && !isOnboarding && !isAuth) {
      router.push("/onboarding");
    }
  }, [currentUser, isLoading, pathname, router]);

  const signInMutation = useMutation<unknown, Error, string>({
    mutationFn: async (provider) => await signInWithProvider(provider),
  });

  const linkSocialAccountMutation = useMutation<
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
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["user", "me"] });
    },
  });

  const unlinkSocialAccountMutation = useMutation<unknown, Error, string>({
    mutationFn: async (providerId) => await unlinkSocialAccount(providerId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["user", "me"] });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.setQueryData(["user", "me"], null);
    },
  });

  const deleteAccountMutation = useMutation({
    mutationFn: deleteAccount,
    onSuccess: () => {
      queryClient.clear();
    },
  });

  return {
    currentUser,
    isAuthenticated: !!currentUser,
    isLoading,
    isError,

    signInWithProvider: signInMutation.mutate,
    linkSocialAccount: linkSocialAccountMutation.mutateAsync,
    unlinkSocialAccount: unlinkSocialAccountMutation.mutateAsync,
    logout: logoutMutation.mutateAsync,
    deleteAccount: deleteAccountMutation.mutateAsync,

    isSigningIn: signInMutation.isPending,
    isLinkingSocialAccount: linkSocialAccountMutation.isPending,
    isUnlinkingSocialAccount: unlinkSocialAccountMutation.isPending,
    isLoggingOut: logoutMutation.isPending,
    isDeletingAccount: deleteAccountMutation.isPending,
  };
}
