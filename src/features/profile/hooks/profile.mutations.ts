import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authKeys } from "@/features/auth/hooks/auth.keys";

import {
  updateProfile,
  updateProfileBanner,
  updateProfileLogo,
} from "../services/profile.service";
import type { UpdateProfileInput } from "../validations/profile.schema";
import { profileKeys, profileMutationKeys } from "./profile.keys";

export interface UpdateProfileVariables {
  userId: string;
  data: UpdateProfileInput;
}

export interface UpdateProfileFileVariables {
  userId: string;
  file: File;
}

export function useUpdateProfileMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: profileMutationKeys.update(),
    mutationFn: ({ userId, data }: UpdateProfileVariables) =>
      updateProfile(userId, data),
    onSuccess: (profile) => {
      queryClient.setQueryData(profileKeys.detail(profile.id), profile);
      queryClient.setQueryData(authKeys.currentUser(), profile);
    },
  });
}

export function useUpdateProfileLogoMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: profileMutationKeys.updateLogo(),
    mutationFn: ({ userId, file }: UpdateProfileFileVariables) =>
      updateProfileLogo(userId, file),
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
      updateProfileBanner(userId, file),
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
