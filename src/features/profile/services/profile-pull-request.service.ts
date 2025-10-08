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
export const getUserPullRequests = async (
  params?: PullRequestQueryParams
): Promise<PullRequestsResponse> => {
  try {
    const queryParams = new URLSearchParams(
      Object.entries(params ?? {})
        .filter(([_, v]) => v !== undefined && v !== null)
        .map(([k, v]) => [k, String(v)])
    );

    const queryString = queryParams.toString();
    const url = `${API_BASE_URL}/users/me/pullrequests${queryString ? `?${queryString}` : ""}`;

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
  } catch (error) {
    console.error("Error fetching pull requests:", error);
    throw error;
  }
};
