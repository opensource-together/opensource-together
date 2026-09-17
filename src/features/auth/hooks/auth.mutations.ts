import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  deleteAccount,
  linkProvider,
  signInWithProvider,
  signOut,
  unlinkProvider,
} from "../services/auth.service";
import type { AuthProvider } from "../types/auth.type";
import { authKeys, authMutationKeys } from "./auth.keys";

export interface SocialAuthCallbackVariables {
  provider: AuthProvider;
  callbackURL?: string;
}

export interface UnlinkSocialAccountVariables {
  providerId: string;
}

export function useSignInMutation() {
  return useMutation({
    mutationKey: authMutationKeys.signIn(),
    mutationFn: ({ provider, callbackURL }: SocialAuthCallbackVariables) =>
      signInWithProvider(provider, callbackURL),
  });
}

export function useLinkSocialAccountMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: authMutationKeys.linkAccount(),
    mutationFn: ({ provider, callbackURL }: SocialAuthCallbackVariables) =>
      linkProvider(provider, callbackURL),
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
      unlinkProvider(providerId),
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
    mutationFn: signOut,
    onSuccess: () => {
      queryClient.clear();
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
