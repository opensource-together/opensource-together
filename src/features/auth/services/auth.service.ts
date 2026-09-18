import type { Profile } from "@/features/profile/types/profile.type";
import {
  ApiError,
  type ApiRequestContext,
  apiData,
} from "@/shared/lib/api-client";
import { authClient } from "@/shared/lib/auth-client";

import type { AuthProvider } from "../types/auth.type";

export async function signInWithProvider(
  provider: AuthProvider
): Promise<void> {
  await authClient.signIn.social({
    provider,
    callbackURL: `${window.location.origin}/onboarding`,
  });
}

export async function linkProvider(
  provider: AuthProvider,
  callbackUrl?: string
): Promise<void> {
  await authClient.linkSocial({
    provider,
    callbackURL: callbackUrl || `${window.location.origin}/dashboard/settings`,
  });
}

export async function unlinkProvider(providerId: string): Promise<void> {
  await authClient.unlinkAccount({ providerId });
}

export async function signOut(): Promise<void> {
  await authClient.signOut();
}

export async function deleteAccount(): Promise<void> {
  await authClient.deleteUser({
    callbackURL: window.location.origin,
  });
}

export async function getCurrentUser(
  context: ApiRequestContext = {}
): Promise<Profile | null> {
  try {
    return await apiData<Profile>("/users/me", context);
  } catch (error) {
    // An anonymous session is a valid application state, not a query failure.
    if (error instanceof ApiError && error.status === 401) return null;
    throw error;
  }
}
