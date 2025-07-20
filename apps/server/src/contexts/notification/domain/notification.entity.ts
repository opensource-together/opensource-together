import { Result } from '@/libs/result';

export type NotificationData = {
  id?: string;
  userId: string;
  type: string;
  payload: Record<string, unknown>;
  createdAt?: Date;
  readAt?: Date | null;
};

export type NotificationPrimitive = NotificationData;

export class Notification {
  private readonly id?: string;
  private readonly userId: string;
  private readonly type: string;
  private readonly payload: Record<string, unknown>;
  private readonly createdAt: Date;
  private readAt: Date | null;

  private constructor(props: {
    id?: string;
    userId: string;
    type: string;
    payload: Record<string, unknown>;
    createdAt?: Date;
    readAt?: Date | null;
  }) {
    this.id = props.id;
    this.userId = props.userId;
    this.type = props.type;
    this.payload = props.payload;
    this.createdAt = props.createdAt || new Date();
    this.readAt = props.readAt || null;
  }

  public static create(props: {
    userId: string;
    type: string;
    payload: Record<string, unknown>;
  }): Result<Notification, string> {
    const validationResult = this.validate(props);
    if (!validationResult.success) {
      return Result.fail(validationResult.error);
    }

    return Result.ok(
      new Notification({
        ...props,
        createdAt: new Date(),
        readAt: null,
      }),
    );
  }

  public static reconstitute(props: {
    id: string;
    userId: string;
    type: string;
    payload: Record<string, unknown>;
    createdAt: Date;
    readAt: Date | null;
  }): Result<Notification, string> {
    const validationResult = this.validate(props);
    if (!validationResult.success) {
      return Result.fail(validationResult.error);
    }

    return Result.ok(new Notification(props));
  }

  private static validate(props: {
    userId: string;
    type: string;
    payload: Record<string, unknown>;
  }): Result<void, string> {
    if (!props.userId || props.userId.trim() === '') {
      return Result.fail('userId is required');
    }
    if (!props.type || props.type.trim() === '') {
      return Result.fail('type is required');
    }
    if (!props.payload) {
      return Result.fail('payload is required');
    }
    return Result.ok(undefined);
  }

  public markAsRead(): void {
    (this as any).readAt = new Date();
  }

  public isRead(): boolean {
    return this.readAt !== null;
  }

  public isUnread(): boolean {
    return this.readAt === null;
  }

  public toPrimitive(): NotificationPrimitive {
    return {
      id: this.id,
      userId: this.userId,
      type: this.type,
      payload: this.payload,
      createdAt: this.createdAt,
      readAt: this.readAt,
    };
  }
}
