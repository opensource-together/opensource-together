export const apiConfig = {
  baseURL: "http://localhost:4000",
  headers: {
    "Content-Type": "application/json",
  },
  credentials: "include" as RequestCredentials, // Important pour les cookies SuperTokens
  getAuthHeader: (): Record<string, string> => {
    // SuperTokens gère l'authentification via cookies, pas besoin de headers manuels
    return {};
  },
};
