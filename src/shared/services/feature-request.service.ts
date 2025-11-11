interface FeatureRequestPayload {
  request: string;
  userInfo?: {
    userName: string;
    userProfileUrl: string;
  };
}

/**
 * Send a feature request via Next.js API route
 *
 * @param payload - The feature request data
 * @returns A promise that resolves when the request is sent
 */
export const sendFeatureRequest = async (
  payload: FeatureRequestPayload
): Promise<void> => {
  const response = await fetch("/api/feature-request", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || "Failed to send feature request");
  }
};
