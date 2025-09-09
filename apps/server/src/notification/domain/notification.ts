import { Result } from '@/libs/result';

export interface NotificationData {
  id?: string;
  object: string;
  receiverId: string;
  senderId: string;
  type: string;
  payload: Record<string, unknown>;
  createdAt?: Date;
  readAt?: Date | null;
}

export function validateNotification(
  notification: Partial<NotificationData>,
): Result<void, string> {
  if (!notification.object?.trim()) return Result.fail('object is required');
  if (!notification.receiverId?.trim())
    return Result.fail('receiverId is required');
  if (!notification.senderId?.trim())
    return Result.fail('senderId is required');
  if (!notification.type?.trim()) return Result.fail('type is required');
  if (!notification.payload) return Result.fail('payload is required');

  return Result.ok(undefined);
}
