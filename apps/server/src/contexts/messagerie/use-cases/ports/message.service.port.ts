import { Result } from '@/libs/result';
import { MessageData, MessageType } from '../../domain/message.entity';
import { RoomData } from '../../domain/room.entity';

export interface SendMessagePayload {
  roomId: string;
  senderId: string;
  content: string;
  messageType?: MessageType;
  replyToId?: string;
}

export interface GetMessagesPayload {
  roomId: string;
  userId: string; // Pour vérifier les permissions
  limit?: number;
  offset?: number;
  beforeMessageId?: string; // Pour pagination
}

export interface CreateRoomPayload {
  participants: string[];
  name?: string;
  description?: string;
}

export interface MarkMessageAsReadPayload {
  messageId: string;
  userId: string;
}

export interface GetUserRoomsPayload {
  userId: string;
  limit?: number;
  offset?: number;
}

export interface MessageServicePort {
  // 📨 Envoi de messages
  sendMessage(
    payload: SendMessagePayload,
  ): Promise<Result<MessageData, string>>;

  // 📬 Récupération des messages
  getMessages(
    payload: GetMessagesPayload,
  ): Promise<Result<MessageData[], string>>;
  getMessageById(
    messageId: string,
  ): Promise<Result<MessageData | null, string>>;

  // 🏠 Gestion des rooms
  createRoom(payload: CreateRoomPayload): Promise<Result<RoomData, string>>;
  getDirectRoom(
    participants: string[],
  ): Promise<Result<RoomData | null, string>>;
  getUserRooms(
    payload: GetUserRoomsPayload,
  ): Promise<Result<RoomData[], string>>;
  getRoomById(
    roomId: string,
    userId: string,
  ): Promise<Result<RoomData | null, string>>;

  // ✅ Gestion des lectures
  markMessageAsRead(
    payload: MarkMessageAsReadPayload,
  ): Promise<Result<void, string>>;
  markAllMessagesAsReadInRoom(
    roomId: string,
    userId: string,
  ): Promise<Result<void, string>>;

  // 🔒 Sécurité et permissions
  canUserAccessRoom(
    roomId: string,
    userId: string,
  ): Promise<Result<boolean, string>>;

  // 📊 Statistiques
  getUnreadMessagesCount(
    roomId: string,
    userId: string,
  ): Promise<Result<number, string>>;
}

export const MESSAGE_SERVICE_PORT = Symbol('MESSAGE_SERVICE_PORT');
