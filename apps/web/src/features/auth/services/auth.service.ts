import { API_BASE_URL } from "@/config/config";

import { authClient } from "@/features/auth/utils/auth-client";
import { Profile } from "@/features/profile/types/profile.type";

/**
 * Check if session exists
 */
export const checkSession = async (): Promise<boolean> => {
  try {
    const { data: session } = await authClient.getSession();
    console.log(session);
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
      console.log("No session exists");
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
      console.log(userData);
      return userData;
    }

    if (response.status === 401) {
      console.log("Session expired");
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
    console.log(provider)
    const response = await fetch(`http://localhost:4000/api/auth/sign-in/social`, {
      method: "POST",
      credentials: "include",
      headers: { 'Content-Type': 'application/json'},
      body: JSON.stringify( { provider, callbackURL: 'http://localhost:3000' }),
    });

    const data: {url: string, redirect: boolean} = await response.json();
    console.log(data);
    if (data.url && data.redirect) {
      window.location.href = data.url;
    } else {
      console.log('une erreure x1')
      throw new Error("No OAuth URL received from server");
    }
  } catch (error) {
    console.log('une erreure')
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
