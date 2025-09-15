export interface NotificationType {
  id: string;
  object: string;
  receiverId: string;
  senderId: string;
  type: string;
  payload: Record<string, unknown>;
  createdAt: Date;
  readAt: Date | null;
}

export interface UnreadNotificationsResponse {
  success: boolean;
  data: NotificationType[];
  count: number;
}

export interface MarkNotificationReadResponse {
  success: boolean;
  message: string;
}
