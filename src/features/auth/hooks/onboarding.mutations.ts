import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProfile } from "@/features/profile/services/profile.service";

import type { OnboardingFormValues } from "../validations/onboarding.schema";
import { authKeys, authMutationKeys } from "./auth.keys";

export interface CompleteOnboardingVariables {
  userId: string;
  userName: string;
  values: OnboardingFormValues;
}

export function useCompleteOnboardingMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: authMutationKeys.completeOnboarding(),
    mutationFn: ({ userId, userName, values }: CompleteOnboardingVariables) =>
      updateProfile(userId, {
        name: userName,
        jobTitle: values.jobTitle,
        userTechStacks: values.techStacks,
        userCategories: values.userCategories,
      }),
    onSuccess: (profile) => {
      queryClient.setQueryData(authKeys.currentUser(), profile);
    },
  });
}
