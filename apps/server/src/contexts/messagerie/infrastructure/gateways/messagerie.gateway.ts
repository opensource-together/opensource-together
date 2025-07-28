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

// Simple auth interface pour le MVP
interface AuthenticatedSocket extends Socket {
  userId?: string;
}
import { MessageGatewayPort } from '../../use-cases/ports/message.gateway.port';
import { MessageData } from '../../domain/message.entity';
import { RoomData } from '../../domain/room.entity';
import { GetUserRoomsQuery } from '../../use-cases/queries/get-user-rooms.query';

/**
 * Gateway WebSocket pour la messagerie en temps réel.
 * Responsabilités :
 * - Gérer les connexions/déconnexions WebSocket
 * - Gérer l'adhésion aux rooms
 * - Diffuser les messages en temps réel
 * - Notifications de présence (typing, online/offline)
 */
@WebSocketGateway({
  cors: {
    credentials: true,
    origin: '*', // ⚠️ À restreindre en production
  },
  namespace: 'messaging', // Namespace dédié pour la messagerie
})
export class MessagerieGateway
  implements OnGatewayConnection, OnGatewayDisconnect, MessageGatewayPort
{
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(MessagerieGateway.name);
  private readonly userSockets = new Map<string, AuthenticatedSocket>(); // userId -> socket
  private readonly userRooms = new Map<string, Set<string>>(); // userId -> Set<roomId>
  private readonly roomUsers = new Map<string, Set<string>>(); // roomId -> Set<userId>
  private readonly typingUsers = new Map<string, Set<string>>(); // roomId -> Set<userId typing>

  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  /**
   * 🔌 Gère la connexion d'un client WebSocket
   */
  async handleConnection(client: AuthenticatedSocket): Promise<void> {
    try {
      // 1. Authentifier le client (MVP - authentification simplifiée)
      const userId = this.extractUserIdFromSocket(client);

      if (!userId) {
        this.logger.warn(`Authentication failed for socket ${client.id}`);
        client.disconnect();
        return;
      }

      // 2. Enregistrer la connexion
      this.userSockets.set(userId, client);
      // console.log('this.userSockets', this.userSockets.get(userId)?.handshake.query.userId);
      this.logger.log(`User ${userId} connected to messaging`);

      // 3. Notifier les autres de son statut online
      await this.notifyUserOnlineStatus(userId, true);

      // 4. Faire rejoindre l'utilisateur à ses rooms existantes
      await this.joinUserExistingRooms(userId);
    } catch (error) {
      this.logger.error(`Connection error for socket ${client.id}:`, error);
      client.disconnect();
    }
  }

  /**
   * 🔌 Gère la déconnexion d'un client WebSocket
   */
  handleDisconnect(client: AuthenticatedSocket): void {
    const userId = this.findUserIdBySocketId(client.id);

    if (userId) {
      // 1. Nettoyer les structures de données
      this.userSockets.delete(userId);

      // 2. Quitter toutes les rooms
      const userRoomSet = this.userRooms.get(userId);
      if (userRoomSet) {
        userRoomSet.forEach((roomId) => {
          this.leaveRoomInternal(userId, roomId);
        });
        this.userRooms.delete(userId);
      }

      // 3. Notifier les autres de son statut offline
      this.notifyUserOnlineStatus(userId, false);

      this.logger.log(`User ${userId} disconnected from messaging`);
    }
  }

  /**
   * 📤 Handler pour rejoindre une room
   */
  @SubscribeMessage('join-room')
  async handleJoinRoom(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { roomId: string },
  ): Promise<void> {
    const userId = client.userId;
    if (!userId) return;

    await this.joinRoom(userId, data.roomId);
  }

  /**
   * 📤 Handler pour quitter une room
   */
  @SubscribeMessage('leave-room')
  async handleLeaveRoom(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { roomId: string },
  ): Promise<void> {
    const userId = client.userId;
    if (!userId) return;

    await this.leaveRoom(userId, data.roomId);
  }

  /**
   * ⌨️ Handler pour les notifications de frappe
   */
  @SubscribeMessage('typing')
  async handleTyping(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { roomId: string; isTyping: boolean },
  ): Promise<void> {
    const userId = client.userId;
    if (!userId) return;

    await this.notifyUserTyping(data.roomId, userId, data.isTyping);
  }

  /**
   * 👥 Handler pour demander la liste des utilisateurs connectés dans une room
   */
  @SubscribeMessage('get-room-users')
  async handleGetRoomUsers(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { roomId: string },
  ): Promise<void> {
    const userId = client.userId;
    if (!userId) return;

    const connectedUsers = await this.getConnectedUsersInRoom(data.roomId);
    client.emit('room-users', {
      roomId: data.roomId,
      connectedUsers,
    });
  }

  // === Implémentation MessageGatewayPort ===

  async sendMessageToRoom(
    roomId: string,
    message: MessageData,
  ): Promise<string | null> {
    try {
      this.server.to(`room:${roomId}`).emit('new-message', message);
      this.logger.log(`Message sent to room ${roomId}: ${message.id}`);
      return null;
    } catch (error) {
      this.logger.error(`Failed to send message to room ${roomId}:`, error);
      return `Failed to send: ${error.message}`;
    }
  }

  async notifyMessageRead(
    roomId: string,
    messageId: string,
    userId: string,
  ): Promise<string | null> {
    try {
      this.server.to(`room:${roomId}`).emit('message-read', {
        messageId,
        userId,
        readAt: new Date(),
      });
      return null;
    } catch (error) {
      this.logger.error(`Failed to notify message read:`, error);
      return `Failed to notify: ${error.message}`;
    }
  }

  async joinRoom(userId: string, roomId: string): Promise<string | null> {
    try {
      const socket = this.userSockets.get(userId);
      if (!socket) {
        return `User ${userId} not connected`;
      }

      // 1. Rejoindre la room Socket.IO
      socket.join(`room:${roomId}`);

      // 2. Mettre à jour les structures de données
      if (!this.userRooms.has(userId)) {
        this.userRooms.set(userId, new Set());
      }
      this.userRooms.get(userId)!.add(roomId);

      if (!this.roomUsers.has(roomId)) {
        this.roomUsers.set(roomId, new Set());
      }
      this.roomUsers.get(roomId)!.add(userId);

      // 3. Notifier les autres participants
      socket.to(`room:${roomId}`).emit('user-joined-room', {
        roomId,
        userId,
        joinedAt: new Date(),
      });

      this.logger.log(`User ${userId} joined room ${roomId}`);
      return null;
    } catch (error) {
      this.logger.error(`Failed to join room:`, error);
      return `Failed to join: ${error.message}`;
    }
  }

  async leaveRoom(userId: string, roomId: string): Promise<string | null> {
    try {
      this.leaveRoomInternal(userId, roomId);
      return null;
    } catch (error) {
      this.logger.error(`Failed to leave room:`, error);
      return `Failed to leave: ${error.message}`;
    }
  }

  async notifyUserTyping(
    roomId: string,
    userId: string,
    isTyping: boolean,
  ): Promise<string | null> {
    try {
      // Mettre à jour l'état des utilisateurs qui tapent
      if (!this.typingUsers.has(roomId)) {
        this.typingUsers.set(roomId, new Set());
      }

      const typingSet = this.typingUsers.get(roomId)!;

      if (isTyping) {
        typingSet.add(userId);
      } else {
        typingSet.delete(userId);
      }

      // Notifier les autres participants (pas l'expéditeur)
      const socket = this.userSockets.get(userId);
      if (socket) {
        socket.to(`room:${roomId}`).emit('user-typing', {
          roomId,
          userId,
          isTyping,
        });
      }

      return null;
    } catch (error) {
      this.logger.error(`Failed to notify typing:`, error);
      return `Failed to notify: ${error.message}`;
    }
  }

  async notifyUserOnlineStatus(
    userId: string,
    isOnline: boolean,
  ): Promise<string | null> {
    try {
      // Récupérer toutes les rooms de l'utilisateur
      const roomsResult = await this.queryBus.execute(
        new GetUserRoomsQuery({ userId }),
      );

      if (roomsResult.success) {
        roomsResult.value.forEach((room) => {
          this.server.to(`room:${room.id}`).emit('user-online-status', {
            userId,
            isOnline,
            timestamp: new Date(),
          });
        });
      }

      return null;
    } catch (error) {
      this.logger.error(`Failed to notify online status:`, error);
      return `Failed to notify: ${error.message}`;
    }
  }

  async notifyRoomCreated(roomData: RoomData): Promise<string | null> {
    try {
      // Notifier tous les participants de la nouvelle room
      roomData.participants.forEach((userId) => {
        const socket = this.userSockets.get(userId);
        if (socket) {
          socket.emit('room-created', roomData);
        }
      });

      return null;
    } catch (error) {
      this.logger.error(`Failed to notify room created:`, error);
      return `Failed to notify: ${error.message}`;
    }
  }

  async notifyRoomUpdated(roomData: RoomData): Promise<string | null> {
    try {
      this.server.to(`room:${roomData.id}`).emit('room-updated', roomData);
      return null;
    } catch (error) {
      this.logger.error(`Failed to notify room updated:`, error);
      return `Failed to notify: ${error.message}`;
    }
  }

  async getConnectedUsersInRoom(roomId: string): Promise<string[]> {
    const roomUsersSet = this.roomUsers.get(roomId);
    if (!roomUsersSet) return [];

    return Array.from(roomUsersSet).filter((userId) =>
      this.userSockets.has(userId),
    );
  }

  async getUserConnectionStatus(userId: string): Promise<boolean> {
    return this.userSockets.has(userId);
  }

  // === Méthodes privées ===

  private leaveRoomInternal(userId: string, roomId: string): void {
    const socket = this.userSockets.get(userId);
    if (socket) {
      socket.leave(`room:${roomId}`);

      // Notifier les autres participants
      socket.to(`room:${roomId}`).emit('user-left-room', {
        roomId,
        userId,
        leftAt: new Date(),
      });
    }

    // Nettoyer les structures de données
    const userRoomSet = this.userRooms.get(userId);
    if (userRoomSet) {
      userRoomSet.delete(roomId);
    }

    const roomUsersSet = this.roomUsers.get(roomId);
    if (roomUsersSet) {
      roomUsersSet.delete(userId);
      if (roomUsersSet.size === 0) {
        this.roomUsers.delete(roomId);
      }
    }

    // Nettoyer l'état typing
    const typingSet = this.typingUsers.get(roomId);
    if (typingSet) {
      typingSet.delete(userId);
    }

    this.logger.log(`User ${userId} left room ${roomId}`);
  }

  private findUserIdBySocketId(socketId: string): string | undefined {
    for (const [userId, socket] of this.userSockets.entries()) {
      if (socket.id === socketId) {
        return userId;
      }
    }
    return undefined;
  }

  private async joinUserExistingRooms(userId: string): Promise<void> {
    try {
      // Récupérer les rooms de l'utilisateur depuis le service
      const roomsResult = await this.queryBus.execute(
        new GetUserRoomsQuery({ userId }),
      );

      if (!roomsResult.success) {
        this.logger.warn(
          `Failed to get rooms for user ${userId}: ${roomsResult.error}`,
        );
        return;
      }

      // Faire rejoindre l'utilisateur à toutes ses rooms existantes
      const rooms = roomsResult.value;
      this.logger.log(
        `Found ${rooms.length} existing rooms for user ${userId}`,
      );

      for (const room of rooms) {
        const joinResult = await this.joinRoom(userId, room.id);
        if (joinResult) {
          this.logger.warn(
            `Failed to auto-join user ${userId} to room ${room.id}: ${joinResult}`,
          );
        } else {
          this.logger.log(
            `User ${userId} auto-joined room ${room.id} (${room.name})`,
          );
        }
      }
    } catch (error) {
      this.logger.error(
        `Failed to join existing rooms for user ${userId}:`,
        error,
      );
    }
  }

  /**
   * Authentification simplifiée pour le MVP
   * En production, utiliser une authentification JWT appropriée
   */
  private extractUserIdFromSocket(client: AuthenticatedSocket): string | null {
    try {
      // Pour le MVP, récupérer l'userId depuis les query parameters
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
