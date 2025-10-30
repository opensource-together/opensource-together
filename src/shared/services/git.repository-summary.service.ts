import { API_BASE_URL } from "@/config/config";

export interface RepositoryDetailsResponse {
  forksCount: number;
  openIssuesCount: number;
  stars: number;
  languages: { [language: string]: number };
  created_at?: string | null;
  updated_at?: string | null;
  pushed_at?: string | null;
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
