import { API_BASE_URL } from "@/config/config";

import { authClient } from "@/features/auth/utils/auth-client";
import { Profile } from "@/features/profile/types/profile.type";

/**
 * Check if session exists
 */
export const checkSession = async (): Promise<boolean> => {
  try {
    const { data: session } = await authClient.getSession();
    return !!session;
  } catch (error) {
    console.error("checkSession error:", error);
    return false;
  }
};

/**
 * Check if session exists and get user profile
 */
export const getCurrentUser = async (): Promise<Profile | null> => {
  try {
    const sessionExists = await checkSession();

    if (!sessionExists) {
      return null;
    }

    const response = await fetch(`${API_BASE_URL}/user/me`, {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      const userData = await response.json();
      return userData;
    }

    if (response.status === 401) {
      return null;
    }

    throw new Error("Failed to fetch user profile");
  } catch (error) {
    console.error("Error fetching current user:", error);
    return null;
  }
};

/**
 * Sign in with a social provider using Better Auth
 */
export const signInWithProvider = async (
  provider: "github" | "google"
): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/sign-in/social`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ provider }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    if (data.url) {
      window.location.href = data.url;
    } else {
      throw new Error("No OAuth URL received from server");
    }
  } catch (error) {
    console.error(`Error signing in with ${provider}:`, error);
    throw new Error(`Failed to sign in with ${provider}`);
  }
};

/**
 * Logout the user
 */
export const logout = async (): Promise<void> => {
  try {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          window.location.href = "/auth/login";
        },
      },
    });
  } catch (error) {
    console.error("logout error:", error);
    throw new Error("Error during the logout.");
  }
};
