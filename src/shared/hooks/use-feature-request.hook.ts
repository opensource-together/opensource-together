import { useMutation } from "@tanstack/react-query";
import { sendFeatureRequest } from "../services/feature-request.service";

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
  return useMutation<void, Error, FeatureRequestVariables>({
    mutationFn: sendFeatureRequest,
  });
}
