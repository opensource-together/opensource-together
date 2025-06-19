// import { mockProfiles } from "../data/mockProfile";
import { useUserStore } from "@/stores/userStore";

import { Profile } from "../types/profileTypes";

/**
 * Get the profile of the authenticated user
 */
export const getCurrentUserProfile = async (): Promise<Profile> => {
  const { profile } = useUserStore.getState();
  try {
    return Promise.resolve(profile as Profile);
  } catch (error) {
    console.error("Error fetching current user profile:", error);
    throw error;
  }
};
