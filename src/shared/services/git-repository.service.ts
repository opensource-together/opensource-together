import { API_BASE_URL } from "@/config/config";

import {
  UserGitRepositoryQueryParams,
  UserGitRepositoryResponse,
} from "../types/git-repository.type";

/**
 * Gets the repositories of the current user.
 *
 * @param params - Optional query parameters to filter repositories.
 * @returns A promise that resolves to the repositories data.
 */
export const getUserRepos = async (
  params?: UserGitRepositoryQueryParams
): Promise<UserGitRepositoryResponse> => {
  const queryParams = new URLSearchParams(
    Object.entries(params ?? {})
      .filter(([_, v]) => v !== undefined && v !== null)
      .map(([k, v]) => [k, String(v)])
  );

  const queryString = queryParams.toString();
  const response = await fetch(
    `${API_BASE_URL}/users/me/repos${queryString ? `?${queryString}` : ""}`,
    {
      method: "GET",
      credentials: "include",
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to fetch user repos");
  }

  const apiResponse = await response.json();
  return apiResponse.data;
};
