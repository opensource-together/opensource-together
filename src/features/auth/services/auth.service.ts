import { API_BASE_URL } from "@/config/config";

import { authClient } from "@/shared/lib/auth-client";

import { Profile } from "@/features/profile/types/profile.type";

export const signInWithProvider = async (provider: string): Promise<void> => {
  try {
    await authClient.signIn.social({
      provider,
      callbackURL: window.location.origin,
    });
  } catch (error) {
    console.error("signInWithProvider error:", error);
    throw error;
  }
};

export const linkSocialAccount = async (provider: string): Promise<void> => {
  try {
    await authClient.linkSocial({
      provider,
      callbackURL: `${window.location.origin}/dashboard/settings`,
    });
  } catch (error) {
    console.error("linkSocialAccount error:", error);
    throw error;
  }
};

export async function logout(): Promise<void> {
  try {
    await authClient.signOut();
    if (typeof window !== "undefined") window.location.replace("/");
  } catch (error) {
    console.error("logout error:", error);
    throw error;
  }
}

export async function deleteAccount(): Promise<void> {
  try {
    await authClient.deleteUser({
      callbackURL: window.location.origin,
    });
  } catch (error) {
    console.error("deleteAccount error:", error);
    throw error;
  }
}

/**
 * Check if session exists and get user profile
 */
export const getCurrentUser = async (): Promise<Profile | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/me`, {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to fetch user profile");
    }

    const apiResponse = await response.json();
    return apiResponse.data || null;
  } catch (error) {
    console.error("Error fetching current user:", error);
    throw error;
  }
};
