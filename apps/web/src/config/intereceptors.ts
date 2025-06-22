import { apiConfig } from "./config";

interface ApiError {
  message?: string;
  statusCode?: number;
}

/**
 * Avant envoi : injecte headers globaux + auth
 */
export function requestInterceptor(options: RequestInit = {}): RequestInit {
  return {
    ...options,
    headers: {
      ...apiConfig.headers,
      ...apiConfig.getAuthHeader(),
      ...options.headers,
    },
  };
}

/**
 * Après réception : gère les erreurs centralisées
 */
export async function responseInterceptor<T>(response: Response): Promise<T> {
  const data = (await response.json()) as T;
  if (!response.ok) {
    const error = data as ApiError;
    const message = error?.message || response.statusText;
    throw new Error(message);
  }
  return data;
}
