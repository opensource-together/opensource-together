import { API_BASE_URL } from "@/config/config";

import {
  MarkAllNotificationsReadResponse,
  MarkNotificationReadResponse,
  UnreadNotificationsResponse,
} from "../types/notification.type";

export async function getUnreadNotifications(): Promise<UnreadNotificationsResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/notifications/unread`, {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    throw new Error(`HTTP error! status: ${error}`);
  }
}
