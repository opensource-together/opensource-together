import { Issue } from "../types/project.type";

export const getGitOpenIssueDetails = async (
  projectId: string,
  issueNumber: number
): Promise<Issue> => {
  try {
    const isServer = typeof window === "undefined";
    const baseUrl =
      process.env.INTERNAL_SERVER_API_URL ??
      process.env.NEXT_PUBLIC_API_URL ??
      "";
    const endpoint = isServer
      ? `${baseUrl}/projects/${projectId}/issues/${issueNumber}`
      : `/api/projects/${projectId}/issues/${issueNumber}`;

    const response = await fetch(endpoint, {
      method: "GET",
      credentials: "include",
    });
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
