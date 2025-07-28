import { Result } from '@/libs/result';

export type MessageData = {
  id?: string;
  roomId: string;
  senderId: string;
  content: string;
  messageType: MessageType;
  replyToId?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
  readBy?: MessageRead[];
};

export type MessageRead = {
  userId: string;
  readAt: Date;
};

export enum MessageType {
  TEXT = 'text',
  IMAGE = 'image',
  FILE = 'file',
  SYSTEM = 'system',
}

export type MessageValidationErrors =
  | 'Content is required'
  | 'Content too long'
  | 'RoomId is required'
  | 'SenderId is required'
  | 'Invalid message type'
  | 'Reply to message not found';

export class Message {
  private readonly id?: string;
  private readonly roomId: string;
  private readonly senderId: string;
  private readonly content: string;
  private readonly messageType: MessageType;
  private readonly replyToId?: string | null;
  private readonly createdAt: Date;
  private readonly updatedAt: Date;
  private readBy: MessageRead[];

  private constructor(props: MessageData) {
    this.id = props.id;
    this.roomId = props.roomId;
    this.senderId = props.senderId;
    this.content = props.content;
    this.messageType = props.messageType;
    this.replyToId = props.replyToId || null;
    this.createdAt = props.createdAt || new Date();
    this.updatedAt = props.updatedAt || new Date();
    this.readBy = props.readBy || [];
  }

  // 🏭 Factory method pour création
  public static create(props: {
    roomId: string;
    senderId: string;
    content: string;
    messageType?: MessageType;
    replyToId?: string;
  }): Result<Message, string> {
    // Validation métier
    const validation = this.validate(props);
    if (!validation.success) {
      return Result.fail(validation.error);
    }

    const messageData: MessageData = {
      roomId: props.roomId,
      senderId: props.senderId,
      content: props.content,
      messageType: props.messageType || MessageType.TEXT,
      replyToId: props.replyToId || null,
    };

    return Result.ok(new Message(messageData));
  }

  // 🔄 Factory method pour reconstitution depuis DB
  public static reconstitute(props: MessageData): Result<Message, string> {
    return Result.ok(new Message(props));
  }

  // ✅ Validation des règles métier
  private static validate(props: {
    roomId: string;
    senderId: string;
    content: string;
    messageType?: MessageType;
  }): Result<void, string> {
    if (!props.roomId || props.roomId.trim() === '') {
      return Result.fail('RoomId is required');
    }

    if (!props.senderId || props.senderId.trim() === '') {
      return Result.fail('SenderId is required');
    }

    if (!props.content || props.content.trim() === '') {
      return Result.fail('Content is required');
    }

    if (props.content.length > 2000) {
      return Result.fail('Content too long');
    }

    if (
      props.messageType &&
      !Object.values(MessageType).includes(props.messageType)
    ) {
      return Result.fail('Invalid message type');
    }

    return Result.ok(undefined);
  }

  // 📖 Méthodes métier
  public markAsReadByUser(userId: string): void {
    // Éviter les doublons
    const existingRead = this.readBy.find((read) => read.userId === userId);
    if (!existingRead) {
      this.readBy.push({
        userId,
        readAt: new Date(),
      });
    }
  }

  public isReadByUser(userId: string): boolean {
    return this.readBy.some((read) => read.userId === userId);
  }

  public isFromUser(userId: string): boolean {
    return this.senderId === userId;
  }

  public isReply(): boolean {
    return this.replyToId !== null && this.replyToId !== undefined;
  }

  // 🔍 Getters
  public getId(): string | undefined {
    return this.id;
  }

  public getRoomId(): string {
    return this.roomId;
  }

  public getSenderId(): string {
    return this.senderId;
  }

  public getContent(): string {
    return this.content;
  }

  public getMessageType(): MessageType {
    return this.messageType;
  }

  public getReplyToId(): string | null | undefined {
    return this.replyToId;
  }

  public getCreatedAt(): Date {
    return this.createdAt;
  }

  public getReadBy(): MessageRead[] {
    return [...this.readBy]; // Copie pour immutabilité
  }

  public toPrimitive(): MessageData {
    return {
      id: this.id,
      roomId: this.roomId,
      senderId: this.senderId,
      content: this.content,
      messageType: this.messageType,
      replyToId: this.replyToId,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      readBy: this.readBy,
    };
  }
}
