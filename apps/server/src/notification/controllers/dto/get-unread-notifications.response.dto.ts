import { ApiProperty } from '@nestjs/swagger';
import { NotificationData } from '../../services/notification.service.interface';

export class NotificationDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  id: string;

  @ApiProperty({ example: 'Nouveau message' })
  object: string;

  @ApiProperty({ example: 'user-123' })
  receiverId: string;

  @ApiProperty({ example: 'user-456' })
  senderId: string;

  @ApiProperty({ example: 'message.received' })
  type: string;

  @ApiProperty({
    example: {
      message: 'Vous avez reçu un nouveau message',
      sender: 'John Doe',
    },
  })
  payload: Record<string, unknown>;

  @ApiProperty({ example: '2023-01-01T10:00:00Z' })
  createdAt: string;

  @ApiProperty({ example: null, nullable: true })
  readAt: string | null;
}

export class GetUnreadNotificationsResponseDto {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ type: [NotificationDto] })
  data: NotificationDto[];

  @ApiProperty({ example: 3 })
  count: number;

  constructor(notifications: NotificationData[]) {
    this.success = true;
    this.data = notifications.map((notification) => {
      return {
        id: notification.id!,
        object: notification.object,
        receiverId: notification.receiverId,
        senderId: notification.senderId,
        type: notification.type,
        payload: notification.payload,
        createdAt: notification.createdAt!.toISOString(),
        readAt: notification.readAt ? notification.readAt.toISOString() : null,
      };
    });
    this.count = this.data.length;
  }
}




