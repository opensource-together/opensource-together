import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { useToastMutation } from "@/shared/hooks/use-toast-mutation";

import { updateProfile } from "@/features/profile/services/profile.service";

import { OnboardingSchema } from "../validations/onboarding.schema";
import useAuth from "./use-auth.hook";

export function useOnboarding() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { currentUser } = useAuth();

  const completeOnboardingMutation = useToastMutation<
    OnboardingSchema,
    Error,
    OnboardingSchema
  >({
    mutationFn: async (data) => {
      await updateProfile(currentUser?.id || "", {
        name: currentUser?.name || "",
        jobTitle: data.jobTitle,
        userTechStacks: data.techStacks,
      });
      return data;
    },
    loadingMessage: "Completing your setup...",
    successMessage:
      "Welcome to OpenSource Together! Your profile is now complete.",
    errorMessage: "Failed to complete onboarding. Please try again.",
    options: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["users", "me"] });
        router.push("/");
      },
    },
  });

  return {
    completeOnboarding: completeOnboardingMutation.mutate,
    isCompletingOnboarding: completeOnboardingMutation.isPending,
  };
}
