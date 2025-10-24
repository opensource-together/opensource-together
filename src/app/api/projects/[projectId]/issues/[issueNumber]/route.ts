import { NextRequest, NextResponse } from "next/server";

import { API_BASE_URL } from "@/config/config";

export async function GET(
  request: NextRequest,
  {
    params,
  }: {
    params: { projectId: string; issueNumber: string };
  }
) {
  const { projectId, issueNumber } = params;

  try {
    const response = await fetch(
      `${API_BASE_URL}/projects/${projectId}/issues/${issueNumber}`,
      {
        method: "GET",
        headers: {
          cookie: request.headers.get("cookie") ?? "",
          accept: "application/json",
        },
        credentials: "include",
      }
    );

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      return NextResponse.json(
        {
          message:
            error.message || "Failed to fetch issue details from backend.",
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Proxy error fetching issue details:", error);
    return NextResponse.json(
      { message: "Unexpected error while fetching issue details." },
      { status: 500 }
    );
  }
}
