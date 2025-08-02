import { authClient } from "@/lib/auth-client";

import { API_BASE_URL } from "@/config/config";

import { Profile } from "@/features/profile/types/profile.type";
import { createAuthClient } from "better-auth/react";

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
 * Sign in with email and password
 */
export const signInWithEmail = async (email: string, password: string) => {
  try {
    const { data, error } = await authClient.signIn.email({
      email,
      password,
      callbackURL: "/dashboard",
    });

    if (error) {
      throw new Error(error.message);
    }

    return { success: true, data };
  } catch (error) {
    console.error("signInWithEmail error:", error);
    throw error;
  }
};

/**
 * Sign up with email and password
 */
export const signUpWithEmail = async (
  email: string,
  password: string,
  name: string
) => {
  try {
    const { data, error } = await authClient.signUp.email({
      email,
      password,
      name,
      callbackURL: "/dashboard",
    });

    if (error) {
      throw new Error(error.message);
    }

    return { success: true, data };
  } catch (error) {
    console.error("signUpWithEmail error:", error);
    throw error;
  }
};

/**
 * Sign in with GitHub
 */
export const signInWithGitHub = async () => {
  try {
    const newAuthClient = createAuthClient({
      baseURL: "http://localhost:4000",
    });
    await newAuthClient.signIn.social({
      provider: "github",
      callbackURL: "http://localhost:3000/auth/callback/github",
      // callbackURL: "/dashboard",
      // errorCallbackURL: "/auth/error",
      // newUserCallbackURL: "/welcome",
    });
  } catch (error) {
    console.error("signInWithGitHub error:", error);
    throw error;
  }
};

/**
 * Sign in with Google
 */
export const signInWithGoogle = async () => {
  try {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: "/dashboard",
      errorCallbackURL: "/auth/error",
      newUserCallbackURL: "/welcome",
    });
  } catch (error) {
    console.error("signInWithGoogle error:", error);
    throw error;
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
          // Redirection vers la page de login après déconnexion
          window.location.href = "/auth/login";
        },
      },
    });
  } catch (error) {
    console.error("logout error:", error);
    throw new Error("Error during the logout.");
  }
};
