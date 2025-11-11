import { sendFeatureRequest } from "../services/feature-request.service";
import { useToastMutation } from "./use-toast-mutation";

interface FeatureRequestVariables {
  request: string;
  userInfo?: {
    userName: string;
    userProfileUrl: string;
  };
}

/**
 * Hook to handle feature request submission
 *
 * @returns Mutation object with mutate function and status
 */
export function useFeatureRequest() {
  const mutation = useToastMutation<void, Error, FeatureRequestVariables>({
    mutationFn: sendFeatureRequest,
    loadingMessage: "Sending your request...",
    successMessage: "Thank you! Your request has been sent successfully",
    errorMessage: "An error occurred. Please try again.",
  });

  return {
    submitFeatureRequest: mutation.mutate,
    submitFeatureRequestAsync: mutation.mutateAsync,
    isSubmitting: mutation.isPending,
    isSubmitError: mutation.isError,
    isSubmitSuccess: mutation.isSuccess,
    submitError: mutation.error,
  };
}
