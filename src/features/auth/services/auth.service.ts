import { API_BASE_URL, FRONTEND_URL } from "@/config/config";

import { authClient } from "@/shared/lib/auth-client";

import { Profile } from "@/features/profile/types/profile.type";

export const signInWithProvider = async (provider: string): Promise<void> => {
  try {
    await authClient.signIn.social({
      provider,
      callbackURL: `${FRONTEND_URL}/`,
    });
  } catch (error) {
    console.error("signInWithProvider error:", error);
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

/**
 * Check if session exists and get user profile
 */
export const getCurrentUser = async (): Promise<Profile | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/me`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
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

/**
 * Get WebSocket token for notifications
 */
export const getWebSocketToken = async (): Promise<string | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/notifications/ws-token`, {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      const data = await response.json();
      return data.wsToken || null; // use 'wsToken' instead of 'token'
    }

    throw new Error("Failed to fetch WebSocket token");
  } catch (error) {
    console.error("Error fetching WebSocket token:", error);
    return null;
  }
};
