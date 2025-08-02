import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: "http://localhost:4000",
});

// Export des méthodes principales pour faciliter l'utilisation
export const { signIn, signUp, signOut, useSession, getSession } = authClient;
