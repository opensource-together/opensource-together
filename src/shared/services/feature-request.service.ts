const DISCORD_WEBHOOK_URL =
  "https://discord.com/api/webhooks/1437814355851874437/Vp2QtHx5iqtKV1r7SA2oJ6p3fPqex5DPFC-_0xDcMIqml1XIUG_NlikAxqm1KvB29RWo";

interface FeatureRequestPayload {
  request: string;
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
          fields: [
            {
              name: "Date",
              value: new Date().toLocaleString("en-US", {
                dateStyle: "full",
                timeStyle: "short",
              }),
              inline: false,
            },
          ],
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
