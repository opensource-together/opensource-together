import { FRONTEND_URL } from "@/config/config";

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
    throw new Error("Error during the sign in with provider.");
  }
};

export async function logout(): Promise<void> {
  try {
    await authClient.signOut();
  } catch (err) {
    console.error("logout error:", err);
    throw new Error("Error during the logout.");
  }
}

/**
 * Check if session exists and get user profile
 */
export const getCurrentUser = async (): Promise<Profile | null> => {
  try {
    const session = await authClient.getSession();

    if (!session.data) {
      return null;
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/profiles/me`,
      {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to fetch user profile");
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching current user:", error);
    return null;
  }
};

/**
 * Get WebSocket token for notifications
 */
export const getWebSocketToken = async (): Promise<string | null> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/notifications/ws-token`,
      {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

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
