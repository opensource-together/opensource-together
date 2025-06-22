import { useUserStore } from "@/stores/userStore";

import { Profile } from "../types/profileTypes";

/**
 * Fetch the authenticated user profile from the API
 */
export const fetchAuthenticatedUserProfile =
  async (): Promise<Profile | null> => {
    try {
      const response = await fetch("http://localhost:4000/profile/me", {
        credentials: "include",
      });

      if (response.ok) {
        const userData = await response.json();
        return userData;
      } else {
        console.warn("Failed to fetch user profile:", response.status);
        return null;
      }
    } catch (error) {
      console.error("Error fetching authenticated user profile:", error);
      throw error;
    }
  };

/**
 * Get the profile of the authenticated user from the store
 */
export const getCurrentUserProfile = async (): Promise<Profile> => {
  const { user } = useUserStore.getState();
  try {
    return Promise.resolve(user as Profile);
  } catch (error) {
    console.error("Error fetching current user profile:", error);
    throw error;
  }
};
