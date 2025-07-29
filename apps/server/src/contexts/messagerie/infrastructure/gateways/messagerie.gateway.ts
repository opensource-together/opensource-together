import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';

// Interface pour les sockets authentifiées
interface AuthenticatedSocket extends Socket {
  userId?: string;
}

import { MessageGatewayPort } from '../../use-cases/ports/message.gateway.port';
import { MessageData } from '../../domain/message.entity';
import { Room, RoomData } from '../../domain/room.entity';
import { GetUserRoomsQuery } from '../../use-cases/queries/get-user-rooms.query';
import { Result } from '@/libs/result';

/**
 * Gateway WebSocket pour la messagerie - VERSION SIMPLIFIÉE
 *
 * Fonctionnalités :
 * 1. Écouter les nouveaux messages d'un chat spécifique
 * 2. Écouter les derniers messages de tous les chats (interface globale)
 * 3. Gérer les connexions/déconnexions
 */
@WebSocketGateway({
  cors: {
    credentials: true,
    origin: '*', // ⚠️ À restreindre en production
  },
  namespace: 'messaging',
})
export class MessagerieGateway
  implements OnGatewayConnection, OnGatewayDisconnect, MessageGatewayPort
{
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(MessagerieGateway.name);
  private readonly userSockets = new Map<string, AuthenticatedSocket>(); // userId -> socket
  private readonly userChats = new Map<string, Set<string>>(); // userId -> Set<chatId>

  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  /**
   * 🔌 Connexion d'un client
   */
  async handleConnection(client: AuthenticatedSocket): Promise<void> {
    try {
      const userId = this.extractUserIdFromSocket(client);

      if (!userId) {
        this.logger.warn(`Authentication failed for socket ${client.id}`);
        client.disconnect();
        return;
      }

      // Enregistrer la connexion
      this.userSockets.set(userId, client);
      this.logger.log(`User ${userId} connected to messaging`);

      // Auto-rejoindre tous ses chats existants
      await this.autoJoinUserChats(userId);
    } catch (error) {
      this.logger.error(`Connection error for socket ${client.id}:`, error);
      client.disconnect();
    }
  }

  /**
   * 🔌 Déconnexion d'un client
   */
  handleDisconnect(client: AuthenticatedSocket): void {
    const userId = this.findUserIdBySocketId(client.id);

    if (userId) {
      this.userSockets.delete(userId);
      this.userChats.delete(userId);
      this.logger.log(`User ${userId} disconnected from messaging`);
    }
  }

  /**
   * 💬 Rejoindre un chat spécifique pour écouter ses messages
   */
  @SubscribeMessage('join-chat')
  handleJoinChat(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { chatId: string },
  ): void {
    const userId = client.userId;
    if (!userId) return;

    this.joinChat(userId, data.chatId);
  }

  /**
   * 👂 Écouter les derniers messages de tous les chats
   * Utile pour l'interface principale avec la liste des discussions
   */
  @SubscribeMessage('listen-all-chats')
  handleListenAllChats(@ConnectedSocket() client: AuthenticatedSocket): void {
    const userId = client.userId;
    if (!userId) return;

    // Rejoindre un canal global pour cet utilisateur
    client.join(`user-global:${userId}`);
    this.logger.log(`User ${userId} is now listening to all their chats`);
  }

  @SubscribeMessage('leave-chat')
  handleLeaveChat(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { chatId: string },
  ): void {
    const userId = client.userId;
    if (!userId) return;
    this.leaveChat(userId, data.chatId);
  }

  @SubscribeMessage('leave-all-chats')
  handleLeaveAllChats(@ConnectedSocket() client: AuthenticatedSocket): void {
    const userId = client.userId;
    if (!userId) return;
    this.leaveAllChats(userId);
  }

  // === Implémentation MessageGatewayPort ===

  /**
   * Envoie un nouveau message à tous les participants d'un chat
   */
  async sendMessageToChat(
    roomId: string,
    message: MessageData,
  ): Promise<string | null> {
    try {
      // Envoyer aux utilisateurs connectés à ce chat spécifique
      this.server.to(`chat:${roomId}`).emit('new-message', {
        chatId: roomId,
        message: message,
        timestamp: new Date(),
      });

      // Envoyer aux utilisateurs écoutant leurs chats globaux
      // (pour mettre à jour la liste des discussions)
      await this.notifyGlobalChatUpdate(roomId, message);

      this.logger.log(`Message sent to chat ${roomId}: ${message.id}`);
      return null;
    } catch (error) {
      this.logger.error(`Failed to send message to chat ${roomId}:`, error);
      return `Failed to send: ${error}`;
    }
  }

  async autoJoinUserChats(userId: string): Promise<void> {
    return await this.autoJoinUserChatsInternal(userId);
  }

  joinChat(userId: string, chatId: string): string | null {
    return this.joinChatInternal(userId, chatId);
  }
  leaveChat(userId: string, chatId: string): string | null {
    return this.leaveChatInternal(userId, chatId);
  }
  leaveAllChats(userId: string): string | null {
    return this.leaveAllChatsInternal(userId);
  }

  // Méthodes non utilisées dans la version simplifiée
  async notifyMessageRead(): Promise<string | null> {
    return await Promise.resolve(null);
  }
  async notifyUserTyping(): Promise<string | null> {
    return await Promise.resolve(null);
  }
  async notifyUserOnlineStatus(): Promise<string | null> {
    return await Promise.resolve(null);
  }
  notifyChatCreated(roomData: RoomData): string | null {
    this.notifyChatCreatedInternal(roomData);
    return null;
  }

  getUserConnectionStatus(userId: string): boolean {
    return this.userSockets.has(userId);
  }

  // === Méthodes privées ===

  private joinChatInternal(userId: string, chatId: string): string | null {
    try {
      const socket = this.userSockets.get(userId);
      if (!socket) {
        return `User ${userId} not connected`;
      }

      // Rejoindre le canal du chat
      socket.join(`chat:${chatId}`);

      // Mettre à jour la liste des chats de l'utilisateur
      if (!this.userChats.has(userId)) {
        this.userChats.set(userId, new Set());
      }
      this.userChats.get(userId)!.add(chatId);

      this.logger.log(`User ${userId} joined chat ${chatId}`);
      return null;
    } catch (error) {
      this.logger.error(`Failed to join chat:`, error);
      return `Failed to join: ${error}`;
    }
  }

  private leaveChatInternal(userId: string, chatId: string): string | null {
    try {
      const socket = this.userSockets.get(userId);
      if (!socket) {
        return `User ${userId} not connected`;
      }

      socket.leave(`chat:${chatId}`);

      this.userChats.get(userId)!.delete(chatId);
      this.logger.log(`User ${userId} left chat ${chatId}`);
      return null;
    } catch (error) {
      this.logger.error(`Failed to leave chat:`, error);
      return `Failed to leave: ${error}`;
    }
  }

  private leaveAllChatsInternal(userId: string): string | null {
    try {
      const socket = this.userSockets.get(userId);
      if (!socket) {
        return `User ${userId} not connected`;
      }

      this.userChats.get(userId)!.forEach((chatId) => {
        socket.leave(`chat:${chatId}`);
      });
      this.userChats.get(userId)!.clear();
      this.logger.log(`User ${userId} left all chats`);
      return null;
    } catch (error) {
      this.logger.error(`Failed to leave chat:`, error);
      return `Failed to leave: ${error}`;
    }
  }

  private async autoJoinUserChatsInternal(userId: string): Promise<void> {
    try {
      // Récupérer tous les chats de l'utilisateur
      const chatsResult: Result<Room[], string> = await this.queryBus.execute(
        new GetUserRoomsQuery({ userId }),
      );

      if (!chatsResult.success) {
        this.logger.warn(
          `Failed to get chats for user ${userId}: ${chatsResult.error}`,
        );
        return;
      }

      // Auto-rejoindre tous ses chats
      const chats: Room[] = chatsResult.value;
      this.logger.log(`Auto-joining ${chats.length} chats for user ${userId}`);

      for (const chat of chats) {
        const chatId = chat.getId();
        if (chatId) {
          this.joinChat(userId, chatId);
        }
      }
    } catch (error) {
      this.logger.error(`Failed to auto-join chats for user ${userId}:`, error);
    }
  }

  private notifyChatCreatedInternal(chat: RoomData): void {
    chat.participants.forEach((userId) => {
      const socket = this.userSockets.get(userId);
      if (socket) {
        socket.emit('chat-created', {
          chat,
          timestamp: new Date(),
        });
      }
    });
  }

  private async notifyGlobalChatUpdate(
    chatId: string,
    lastMessage: MessageData,
  ): Promise<void> {
    try {
      // Récupérer tous les participants du chat
      const chatsResult: Result<Room[], string> = await this.queryBus.execute(
        new GetUserRoomsQuery({ userId: lastMessage.senderId }),
      );

      if (chatsResult.success) {
        const chat = chatsResult.value.find((c) => c.getId() === chatId);
        if (chat) {
          // Notifier tous les participants sur leur canal global
          chat.getParticipants().forEach((userId) => {
            this.server.to(`user-global:${userId}`).emit('chat-updated', {
              chatId,
              lastMessage,
              timestamp: new Date(),
            });
          });
        }
      }
    } catch (error) {
      this.logger.error('Failed to notify global chat update:', error);
    }
  }

  private findUserIdBySocketId(socketId: string): string | undefined {
    for (const [userId, socket] of this.userSockets.entries()) {
      if (socket.id === socketId) {
        return userId;
      }
    }
    return undefined;
  }

  private extractUserIdFromSocket(client: AuthenticatedSocket): string | null {
    try {
      // Récupérer l'userId depuis les query parameters
      const userId = client.handshake?.query?.userId;

      if (typeof userId === 'string' && userId.trim() !== '') {
        client.userId = userId;
        return userId;
      }

      // Alternative: récupérer depuis les headers
      const userIdHeader = client.handshake?.headers?.['x-user-id'];
      if (typeof userIdHeader === 'string' && userIdHeader.trim() !== '') {
        client.userId = userIdHeader;
        return userIdHeader;
      }

      return null;
    } catch (error) {
      this.logger.error('Error extracting userId from socket:', error);
      return null;
    }
  }
}
