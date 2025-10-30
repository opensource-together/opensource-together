import { API_BASE_URL } from "@/config/config";

export interface RepositoryDetailsResponse {
  name: string;
  description: string | null;
  url: string | null;
  html_url: string;
  created_at?: string | null;
  updated_at?: string | null;
  pushed_at?: string | null;
  stars: number;
  tags: string[];
  forksCount: number;
  openIssuesCount: number;
  pullRequestsCount: number;
  visibility?: string | null;
  owner: {
    login: string | undefined;
    avatar_url: string | undefined;
  };
  languages: { [language: string]: number };
}

export const getProjectRepositorySummary = async (
  projectId: string
): Promise<RepositoryDetailsResponse> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/projects/${projectId}/repository-summary`,
      {
        method: "GET",
        credentials: "include",
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Error fetching repository summary");
    }

    const apiResponse = await response.json();
    return apiResponse?.data || apiResponse;
  } catch (error) {
    console.error("Error fetching repository summary:", error);
    throw error;
  }
};
