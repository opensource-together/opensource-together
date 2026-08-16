import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  deleteAccount,
  linkSocialAccount,
  logout,
  signInWithProvider,
  unlinkSocialAccount,
} from "../services/auth.service";
import type { AuthProvider } from "../types/auth.type";
import { authKeys, authMutationKeys } from "./auth.keys";

export interface LinkSocialAccountVariables {
  provider: AuthProvider;
  callbackURL?: string;
}

export interface UnlinkSocialAccountVariables {
  providerId: string;
}

export function useSignInMutation() {
  return useMutation({
    mutationKey: authMutationKeys.signIn(),
    mutationFn: (provider: AuthProvider) => signInWithProvider(provider),
  });
}

export function useLinkSocialAccountMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: authMutationKeys.linkAccount(),
    mutationFn: ({ provider, callbackURL }: LinkSocialAccountVariables) =>
      linkSocialAccount(provider, callbackURL),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: authKeys.currentUser(),
      });
    },
  });
}

export function useUnlinkSocialAccountMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: authMutationKeys.unlinkAccount(),
    mutationFn: ({ providerId }: UnlinkSocialAccountVariables) =>
      unlinkSocialAccount(providerId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: authKeys.currentUser(),
      });
    },
  });
}

export function useLogoutMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: authMutationKeys.logout(),
    mutationFn: logout,
    onSuccess: () => {
      queryClient.setQueryData(authKeys.currentUser(), null);
    },
  });
}

export function useDeleteAccountMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: authMutationKeys.deleteAccount(),
    mutationFn: deleteAccount,
    onSuccess: () => {
      queryClient.clear();
    },
  });
}
