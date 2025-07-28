import { Result } from '@/libs/result';

export type RoomData = {
  id?: string;
  participants: string[]; // Array d'userIds
  roomType: RoomType;
  name?: string | null;
  description?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
  lastMessageAt?: Date | null;
  isActive?: boolean;
};

export enum RoomType {
  DIRECT = 'direct', // Conversation 1-à-1
  GROUP = 'group', // Conversation de groupe (futur)
  SYSTEM = 'system', // Messages système
}

export type RoomValidationErrors =
  | 'At least 2 participants required'
  | 'Too many participants for direct room'
  | 'Duplicate participants not allowed'
  | 'Invalid room type'
  | 'Room name required for group rooms';

export class Room {
  private readonly id?: string;
  private readonly participants: string[];
  private readonly roomType: RoomType;
  private readonly name?: string | null;
  private readonly description?: string | null;
  private readonly createdAt: Date;
  private readonly updatedAt: Date;
  private lastMessageAt?: Date | null;
  private isActive: boolean;

  private constructor(props: RoomData) {
    this.id = props.id;
    this.participants = [...props.participants]; // Copie pour immutabilité
    this.roomType = props.roomType;
    this.name = props.name || null;
    this.description = props.description || null;
    this.createdAt = props.createdAt || new Date();
    this.updatedAt = props.updatedAt || new Date();
    this.lastMessageAt = props.lastMessageAt || null;
    this.isActive = props.isActive !== undefined ? props.isActive : true;
  }

  // 🏭 Factory method pour création de room directe (MVP)
  public static createDirectRoom(props: {
    participants: string[];
    name?: string;
  }): Result<Room, string> {
    const validation = this.validateDirectRoom(props.participants);
    if (!validation.success) {
      return Result.fail(validation.error);
    }

    // Trier les participants pour garantir un ID de room consistant
    const sortedParticipants = [...props.participants].sort();

    const roomData: RoomData = {
      participants: sortedParticipants,
      roomType: RoomType.DIRECT,
      name: props.name || null,
    };

    return Result.ok(new Room(roomData));
  }

  // 🏭 Factory method pour reconstitution depuis DB
  public static reconstitute(props: RoomData): Result<Room, string> {
    return Result.ok(new Room(props));
  }

  // ✅ Validation pour room directe
  private static validateDirectRoom(
    participants: string[],
  ): Result<void, string> {
    if (!participants || participants.length < 2) {
      return Result.fail('At least 2 participants required');
    }

    if (participants.length > 2) {
      return Result.fail('Too many participants for direct room');
    }

    // Vérifier les doublons
    const uniqueParticipants = new Set(participants);
    if (uniqueParticipants.size !== participants.length) {
      return Result.fail('Duplicate participants not allowed');
    }

    return Result.ok(undefined);
  }

  // 📖 Méthodes métier
  public hasParticipant(userId: string): boolean {
    return this.participants.includes(userId);
  }

  public getOtherParticipant(userId: string): string | null {
    if (this.roomType !== RoomType.DIRECT) {
      return null;
    }

    const other = this.participants.find((p) => p !== userId);
    return other || null;
  }

  public updateLastMessageAt(): void {
    this.lastMessageAt = new Date();
  }

  public deactivate(): void {
    this.isActive = false;
  }

  public activate(): void {
    this.isActive = true;
  }

  public isDirectRoom(): boolean {
    return this.roomType === RoomType.DIRECT;
  }

  // 🆔 Génération d'ID pour room directe
  public static generateDirectRoomId(userIds: string[]): string {
    if (userIds.length !== 2) {
      throw new Error('Direct room requires exactly 2 users');
    }

    // Trier pour garantir un ID consistant
    const sortedIds = [...userIds].sort();
    return `direct_${sortedIds[0]}_${sortedIds[1]}`;
  }

  // 🔍 Getters
  public getId(): string | undefined {
    return this.id;
  }

  public getParticipants(): string[] {
    return [...this.participants]; // Copie pour immutabilité
  }

  public getRoomType(): RoomType {
    return this.roomType;
  }

  public getName(): string | null | undefined {
    return this.name;
  }

  public getDescription(): string | null | undefined {
    return this.description;
  }

  public getCreatedAt(): Date {
    return this.createdAt;
  }

  public getLastMessageAt(): Date | null | undefined {
    return this.lastMessageAt;
  }

  public getIsActive(): boolean {
    return this.isActive;
  }

  public toPrimitive(): RoomData {
    return {
      id: this.id,
      participants: this.participants,
      roomType: this.roomType,
      name: this.name,
      description: this.description,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      lastMessageAt: this.lastMessageAt,
      isActive: this.isActive,
    };
  }
}
