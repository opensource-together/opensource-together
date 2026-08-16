import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProfile } from "@/features/profile/services/profile.service";

import type { OnboardingSchema } from "../validations/onboarding.schema";
import useAuth from "./use-auth.hook";

export function useOnboarding() {
  const queryClient = useQueryClient();
  const { currentUser } = useAuth();

  return useMutation<OnboardingSchema, Error, OnboardingSchema>({
    mutationFn: async (data) => {
      await updateProfile(currentUser?.id || "", {
        name: currentUser?.name || "",
        jobTitle: data.jobTitle,
        userTechStacks: data.techStacks,
        userCategories: data.userCategories,
      });
      return data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["user", "me"] });
    },
  });
}
