import { Result } from '@/libs/result';

export type NotificationData = {
  id?: string;
  object: string;
  receiverId: string;
  senderId: string;
  type: string;
  payload: Record<string, unknown>;
  createdAt?: Date;
  readAt?: Date | null;
};

export type NotificationPrimitive = NotificationData;

export class Notification {
  private readonly id?: string;
  private readonly object: string;
  private readonly receiverId: string;
  private readonly senderId: string;
  private readonly type: string;
  private readonly payload: Record<string, unknown>;
  private readonly createdAt: Date;
  private readAt: Date | null;

  private constructor(props: {
    id?: string;
    object: string;
    receiverId: string;
    senderId: string;
    type: string;
    payload: Record<string, unknown>;
    createdAt?: Date;
    readAt?: Date | null;
  }) {
    this.id = props.id;
    this.object = props.object;
    this.receiverId = props.receiverId;
    this.senderId = props.senderId;
    this.type = props.type;
    this.payload = props.payload;
    this.createdAt = props.createdAt || new Date();
    this.readAt = props.readAt || null;
  }

  public static create(props: {
    object: string;
    receiverId: string;
    senderId: string;
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
    object: string;
    receiverId: string;
    senderId: string;
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
    object: string;
    receiverId: string;
    senderId: string;
    type: string;
    payload: Record<string, unknown>;
  }): Result<void, string> {
    if (!props.object || props.object.trim() === '') {
      return Result.fail('object is required');
    }
    if (!props.receiverId || props.receiverId.trim() === '') {
      return Result.fail('receiverId is required');
    }
    if (!props.senderId || props.senderId.trim() === '') {
      return Result.fail('senderId is required');
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
    this.readAt = new Date();
  }

  public isRead(): boolean {
    return this.readAt !== null;
  }

  public isUnread(): boolean {
    return this.readAt === null;
  }

  public getReceiverId(): string {
    return this.receiverId;
  }

  public getSenderId(): string {
    return this.senderId;
  }

  public toPrimitive(): NotificationPrimitive {
    return {
      id: this.id,
      object: this.object,
      receiverId: this.receiverId,
      senderId: this.senderId,
      type: this.type,
      payload: this.payload,
      createdAt: this.createdAt,
      readAt: this.readAt,
    };
  }
}
