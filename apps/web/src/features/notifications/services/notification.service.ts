import { API_BASE_URL } from "@/config/config";

import {
  MarkNotificationReadResponse,
  UnreadNotificationsResponse,
} from "../types/notification.type";

/**
 * Get unread notifications
 * @returns Unread notifications
 */
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

/**
 * Mark a notification as read
 * @param notificationId - The ID of the notification to mark as read
 * @returns The response from the API
 */
export async function markNotificationAsRead(
  notificationId: string
): Promise<MarkNotificationReadResponse> {
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

    return response.json();
  } catch (error) {
    throw new Error(`Failed to mark notification as read: ${error}`);
  }
}

/**
 * Mark all notifications as read
 * @returns The response from the API
 */
export async function markAllNotificationsAsRead(): Promise<MarkNotificationReadResponse> {
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

    return response.json();
  } catch (error) {
    throw new Error(`Failed to mark all notifications as read: ${error}`);
  }
}
