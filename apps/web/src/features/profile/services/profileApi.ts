import { mockProfiles } from "../data/mockProfile";
import { Profile } from "../types/profileTypes";

/**
 * Get the profile of the authenticated user
 */
export const getCurrentUserProfile = async (): Promise<Profile> => {
  try {
    return Promise.resolve(mockProfiles[0]);
  } catch (error) {
    console.error("Error fetching current user profile:", error);
    throw error;
  }
};
