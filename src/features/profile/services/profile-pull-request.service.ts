import { API_BASE_URL } from "@/config/config";

import {
  PullRequestQueryParams,
  PullRequestsResponse,
} from "../types/profile.pull-request.type";

/**
 * Gets the pull requests of the current user.
 *
 * @param params - Optional query parameters to filter pull requests.
 * @returns A promise that resolves to the pull requests data.
 */
export const getUserMyPullRequests = async (
  params?: PullRequestQueryParams
): Promise<PullRequestsResponse> => {
  const queryParams = new URLSearchParams(
    Object.entries(params ?? {})
      .filter(([_, v]) => v !== undefined && v !== null)
      .map(([k, v]) => [k, String(v)])
  );

  const queryString = queryParams.toString();
  const url = `${API_BASE_URL}/users/me/pull-requests${queryString ? `?${queryString}` : ""}`;

  const response = await fetch(url, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to fetch pull requests");
  }

  const apiResponse = await response.json();
  return apiResponse.data;
};

/**
 * Gets the pull requests of a specific user by their ID.
 *
 * @param userId - The ID of the user to fetch pull requests for.
 * @param params - Optional query parameters to filter pull requests.
 * @returns A promise that resolves to the pull requests data.
 */
export const getUserPullRequestsById = async (
  userId: string,
  params?: PullRequestQueryParams
): Promise<PullRequestsResponse> => {
  const queryParams = new URLSearchParams(
    Object.entries(params ?? {})
      .filter(([_, v]) => v !== undefined && v !== null)
      .map(([k, v]) => [k, String(v)])
  );

  const queryString = queryParams.toString();
  const url = `${API_BASE_URL}/users/${userId}/pull-requests${queryString ? `?${queryString}` : ""}`;

  const response = await fetch(url, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to fetch user pull requests");
  }

  const apiResponse = await response.json();
  return apiResponse.data;
};
