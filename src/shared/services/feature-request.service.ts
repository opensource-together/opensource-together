interface FeatureRequestPayload {
  request: string;
  userInfo?: {
    userName: string;
    userProfileUrl: string;
  };
}

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
