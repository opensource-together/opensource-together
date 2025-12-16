import { type NextRequest, NextResponse } from "next/server";

const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL;

interface FeatureRequestBody {
  request: string;
  userInfo?: {
    userName: string;
    userProfileUrl: string;
  };
}

/**
 * POST /api/feature-request
 * Sends a feature request to Discord webhook
 */
export async function POST(request: NextRequest) {
  try {
    if (!DISCORD_WEBHOOK_URL) {
      console.error("DISCORD_WEBHOOK_URL is not configured");
      return NextResponse.json(
        { error: "Webhook configuration is missing" },
        { status: 500 }
      );
    }

    const body: FeatureRequestBody = await request.json();

    if (!body.request || typeof body.request !== "string") {
      return NextResponse.json(
        { error: "Invalid request payload" },
        { status: 400 }
      );
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

    if (body.userInfo) {
      fields.push({
        name: "User",
        value: `[${body.userInfo.userName}](${body.userInfo.userProfileUrl})`,
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
            description: body.request,
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
      const errorText = await response.text();
      console.error("Discord webhook error:", errorText);
      return NextResponse.json(
        { error: "Failed to send feature request" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Feature request sent successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing feature request:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
