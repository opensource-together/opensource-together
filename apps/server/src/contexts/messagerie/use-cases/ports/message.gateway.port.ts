import { MessageData } from '../../domain/message.entity';
import { RoomData } from '../../domain/room.entity';

export interface MessageGatewayPort {
  // 📨 Envoi de messages en temps réel
  sendMessageToChat(
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
  joinChat(userId: string, roomId: string): string | null;
  leaveChat(userId: string, roomId: string): string | null;
  autoJoinUserChats(userId: string): Promise<void>;
  leaveAllChats(userId: string): string | null;

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
  notifyChatCreated(roomData: RoomData): string | null;

  // 📊 Métriques
  // getConnectedUsersInChat(roomId: string): Promise<string[]>;
  getUserConnectionStatus(userId: string): boolean;
}

export const MESSAGE_GATEWAY_PORT = Symbol('MESSAGE_GATEWAY_PORT');
