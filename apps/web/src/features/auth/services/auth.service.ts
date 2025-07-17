import Session from "supertokens-web-js/recipe/session";
import {
  getAuthorisationURLWithQueryParamsAndSetState,
  signInAndUp,
} from "supertokens-web-js/recipe/thirdparty";

import { API_BASE_URL } from "@/config/config";

import { Profile } from "@/features/profile/types/profile.type";

// Global flag to track SuperTokens initialization
let isInitialized = false;

/**
 * Set SuperTokens as initialized (called from SuperTokensInitializer)
 */
export const setSuperTokensInitialized = () => {
  isInitialized = true;
};

/**
 * Check if session exists
 */
export const checkSession = async (): Promise<boolean> => {
  try {
    // Check if SuperTokens is initialized first
    if (!isInitialized) {
      return false;
    }

    const sessionExists = await Session.doesSessionExist();
    return sessionExists;
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

    const response = await fetch(`${API_BASE_URL}/profile/me`, {
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
 * Get the GitHub authentication URL
 */
export async function getGitHubAuthUrl(): Promise<string> {
  return getAuthorisationURLWithQueryParamsAndSetState({
    thirdPartyId: "github",
    frontendRedirectURI: "http://localhost:3000/auth/callback/github",
  });
}

/**
 * Handle the GitHub callback after the authorization
 */
export async function handleGitHubCallback(): Promise<{ success: boolean }> {
  try {
    const response = await signInAndUp();
    const sessionExists = await checkSession();

    if (response.status === "OK" && sessionExists) {
      return { success: true };
    }

    if (response.status === "NO_EMAIL_GIVEN_BY_PROVIDER") {
      throw new Error("GitHub didn't provide an email");
    }

    if (!sessionExists) {
      throw new Error("The session couldn't be created after login.");
    }

    throw new Error("An error occurred during the login.");
  } catch (err) {
    console.error("handleGitHubCallback error:", err);
    throw new Error("Error during the login via GitHub.");
  }
}

/**
 * Logout the user
 */
export async function logout(): Promise<void> {
  try {
    await Session.signOut();
  } catch (err) {
    console.error("logout error:", err);
    throw new Error("Error during the logout.");
  }
}
