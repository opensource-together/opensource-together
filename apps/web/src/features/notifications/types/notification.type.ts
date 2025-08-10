export interface Notification {
  id: string;
  object: string;
  receiverId: string;
  senderId: string;
  type: NotificationType;
  payload: Record<string, unknown>;
  createdAt: string;
  readAt: string | null;
}

export type NotificationType =
  | "project.role.application.created"
  | "project.role.application.accepted"
  | "project.role.application.rejected"
  | "project.created"
  | "project.updated"
  | "project.deleted"
  | "message.received";

export interface NotificationResponse {
  status: string;
  message: string;
  success: boolean;
}

export interface UnreadNotificationsResponse {
  success: boolean;
  data: Notification[];
  total: number;
}

export interface MarkNotificationReadResponse {
  success: boolean;
  message: string;
}

export interface MarkAllNotificationsReadResponse {
  success: boolean;
  message: string;
}
