import { Notification } from '../../../domain/notification.entity';

export class NotificationDto {
  id: string;
  receiverId: string;
  senderId: string;
  type: string;
  payload: Record<string, unknown>;
  createdAt: string;
  readAt: string | null;
}

export class GetUnreadNotificationsResponseDto {
  success: boolean;
  data: NotificationDto[];
  count: number;

  constructor(notifications: Notification[]) {
    this.success = true;
    this.data = notifications.map((notification) => {
      const primitive = notification.toPrimitive();
      return {
        id: primitive.id!,
        receiverId: primitive.receiverId,
        senderId: primitive.senderId,
        type: primitive.type,
        payload: primitive.payload,
        createdAt: primitive.createdAt!.toISOString(),
        readAt: primitive.readAt ? primitive.readAt.toISOString() : null,
      };
    });
    this.count = this.data.length;
  }

  static fromNotifications(
    notifications: Notification[],
  ): GetUnreadNotificationsResponseDto {
    return new GetUnreadNotificationsResponseDto(notifications);
  }
}
