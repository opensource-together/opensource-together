const DISCORD_WEBHOOK_URL = process.env.NEXT_PUBLIC_DISCORD_WEBHOOK_URL;

interface FeatureRequestPayload {
  request: string;
  userInfo?: {
    userName: string;
    userProfileUrl: string;
  };
}

/**
 * Send a feature request to Discord webhook
 *
 * @param payload - The feature request data
 * @returns A promise that resolves when the request is sent
 */
export const sendFeatureRequest = async (
  payload: FeatureRequestPayload
): Promise<void> => {
  if (!DISCORD_WEBHOOK_URL) {
    throw new Error("DISCORD_WEBHOOK_URL is not configured");
  }

  const fields = [
    {
      name: "Date",
      value: new Date().toLocaleString("en-US", {
        dateStyle: "full",
        timeStyle: "short",
      }),
      inline: false,
    },
  ];

  if (payload.userInfo) {
    fields.push({
      name: "User",
      value: `[${payload.userInfo.userName}](${payload.userInfo.userProfileUrl})`,
      inline: false,
    });
  }

  const response = await fetch(DISCORD_WEBHOOK_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      embeds: [
        {
          title: "New Feature Request",
          description: payload.request,
          color: 5814783,
          fields,
          footer: {
            text: "OpenSource Together",
          },
          timestamp: new Date().toISOString(),
        },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to send feature request");
  }
};
