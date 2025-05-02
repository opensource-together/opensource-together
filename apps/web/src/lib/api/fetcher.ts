import { apiConfig } from "./config";
import { requestInterceptor, responseInterceptor } from "./intereceptors";

/**
 * Fonction unique de fetch utilisée par toutes les méthodes HTTP.
 */
async function request<T>(url: string, options: RequestInit = {}): Promise<T> {
  // 1) Prépare la requête avec headers + auth
  const init = requestInterceptor(options);

  // 2) Exécute le fetch
  const response = await fetch(apiConfig.baseURL + url, init);

  // 3) Applique l'intercepteur de réponse (gestion des erreurs)
  return responseInterceptor<T>(response);
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
