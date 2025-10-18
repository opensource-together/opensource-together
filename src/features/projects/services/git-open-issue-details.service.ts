import { API_BASE_URL } from "@/config/config";

import { Issue } from "../types/project.type";

export const getGitOpenIssueDetails = async (
  projectId: string,
  issueNumber: number
): Promise<Issue> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/projects/${projectId}/issues/${issueNumber}`,
      {
        method: "GET",
      }
    );
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Error fetching Git open issue details");
    }
    const apiResponse = await response.json();
    return apiResponse.data;
  } catch (error) {
    console.error("Error fetching Git open issue details:", error);
    throw error;
  }
};
