import { API_BASE_URL } from "@/config/config";

import { UnreadNotificationsResponse } from "../types/notification.type";

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

export async function markNotificationAsRead(
  notificationId: string
): Promise<void> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/notifications/${notificationId}/read`,
      {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    throw new Error(`Failed to mark notification as read: ${error}`);
  }
}

export async function markAllNotificationsAsRead(): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/notifications/read-all`, {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    throw new Error(`Failed to mark all notifications as read: ${error}`);
  }
}
