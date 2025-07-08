import { apiConfig } from "./config";

/**
 * Fonction unique de fetch utilisée par toutes les méthodes HTTP.
 * Utilise les cookies SuperTokens pour l'authentification automatique.
 */
async function request<T>(url: string, options: RequestInit = {}): Promise<T> {
  // Utilise le fetch natif avec les bonnes credentials pour SuperTokens
  const response = await fetch(apiConfig.baseURL + url, {
    ...options,
    headers: {
      ...apiConfig.headers,
      ...options.headers,
    },
    credentials: apiConfig.credentials, // Important pour les cookies SuperTokens
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const message = errorData?.message || response.statusText;
    throw new Error(message);
  }

  return response.json() as Promise<T>;
}

/**
 * Méthodes HTTP centralisées
 */
export function get<T>(url: string): Promise<T> {
  return request<T>(url, { method: "GET" });
}

export function post<T, B>(url: string, body: B): Promise<T> {
  return request<T>(url, {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export function put<T, B>(url: string, body: B): Promise<T> {
  return request<T>(url, {
    method: "PUT",
    body: JSON.stringify(body),
  });
}

export function del<T>(url: string): Promise<T> {
  return request<T>(url, { method: "DELETE" });
}
