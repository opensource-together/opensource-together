import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authKeys } from "@/features/auth/hooks/auth.keys";

import {
  updateProfile,
  uploadProfileAvatar,
  uploadProfileBanner,
} from "../services/profile.service";
import type { UpdateProfileInput } from "../validations/profile.schema";
import { profileKeys, profileMutationKeys } from "./profile.keys";

export type UpdateProfileVariables = {
  userId: string;
  data: UpdateProfileInput;
};

export type UpdateProfileFileVariables = {
  userId: string;
  file: File;
};

export function useUpdateProfileMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: profileMutationKeys.update(),
    mutationFn: ({ userId, data }: UpdateProfileVariables) =>
      updateProfile(userId, data),
    onSuccess: async (_, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: profileKeys.detail(variables.userId),
        }),
        queryClient.invalidateQueries({ queryKey: authKeys.currentUser() }),
      ]);
    },
  });
}

export function useUpdateProfileLogoMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: profileMutationKeys.updateLogo(),
    mutationFn: ({ userId, file }: UpdateProfileFileVariables) =>
      uploadProfileAvatar(userId, file),
    onSuccess: async (_, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: profileKeys.detail(variables.userId),
        }),
        queryClient.invalidateQueries({ queryKey: authKeys.currentUser() }),
      ]);
    },
  });
}

export function useUpdateProfileBannerMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: profileMutationKeys.updateBanner(),
    mutationFn: ({ userId, file }: UpdateProfileFileVariables) =>
      uploadProfileBanner(userId, file),
    onSuccess: async (_, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: profileKeys.detail(variables.userId),
        }),
        queryClient.invalidateQueries({ queryKey: authKeys.currentUser() }),
      ]);
    },
  });
}
