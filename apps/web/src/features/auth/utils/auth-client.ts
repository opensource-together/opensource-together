import { createAuthClient } from "better-auth/react";

import { API_BASE_URL } from "@/config/config";

export const authClient = createAuthClient({
  baseURL: `http://localhost:4000/api/auth`,
});

// Export des méthodes principales pour faciliter l'utilisation
export const { signIn, signUp, signOut, useSession, getSession } = authClient;
