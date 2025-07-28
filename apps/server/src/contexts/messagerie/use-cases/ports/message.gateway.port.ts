import { MessageData } from '../../domain/message.entity';
import { RoomData } from '../../domain/room.entity';

export interface MessageGatewayPort {
  // 📨 Envoi de messages en temps réel
  sendMessageToRoom(
    roomId: string,
    message: MessageData,
  ): Promise<string | null>;

  // 📬 Notifications de lecture
  notifyMessageRead(
    roomId: string,
    messageId: string,
    userId: string,
  ): Promise<string | null>;

  // 🏠 Gestion des rooms
  joinRoom(userId: string, roomId: string): Promise<string | null>;
  leaveRoom(userId: string, roomId: string): Promise<string | null>;

  // 👥 Notifications de présence (typing, online/offline)
  notifyUserTyping(
    roomId: string,
    userId: string,
    isTyping: boolean,
  ): Promise<string | null>;
  notifyUserOnlineStatus(
    userId: string,
    isOnline: boolean,
  ): Promise<string | null>;

  // 🔔 Notifications système
  notifyRoomCreated(roomData: RoomData): Promise<string | null>;
  notifyRoomUpdated(roomData: RoomData): Promise<string | null>;

  // 📊 Métriques
  getConnectedUsersInRoom(roomId: string): Promise<string[]>;
  getUserConnectionStatus(userId: string): Promise<boolean>;
}

export const MESSAGE_GATEWAY_PORT = Symbol('MESSAGE_GATEWAY_PORT');
