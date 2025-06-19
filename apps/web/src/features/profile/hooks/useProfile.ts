import { useQuery } from "@tanstack/react-query";

import { getCurrentUserProfile } from "../services/profileApi";
import { Profile } from "../types/profileTypes";

/**
 * Hook to get the profile of the authenticated user
 * @returns Query result containing the authenticated user's profile
 */
export const useCurrentUserProfile = () => {
  return useQuery<Profile>({
    queryKey: ["user/me"],
    queryFn: getCurrentUserProfile,
  });
};
