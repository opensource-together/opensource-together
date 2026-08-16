import { apiRequest } from "@/shared/lib/api-client";

interface FeatureRequestPayload {
  request: string;
  userInfo?: {
    userName: string;
    userProfileUrl: string;
  };
}

export async function sendFeatureRequest(
  payload: FeatureRequestPayload
): Promise<void> {
  await apiRequest("/api/feature-request", {
    baseUrl: "",
    method: "POST",
    json: payload,
  });
}
