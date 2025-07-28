import { Injectable, Inject, forwardRef } from '@nestjs/common';
import {
  MESSAGE_GATEWAY_PORT,
  MessageGatewayPort,
} from '../../use-cases/ports/message.gateway.port';
import { MessageData } from '../../domain/message.entity';
import { RoomData } from '../../domain/room.entity';

@Injectable()
export class RealtimeMessageNotifierAdapter {
  constructor(
    @Inject(forwardRef(() => MESSAGE_GATEWAY_PORT))
    private readonly messageGateway: MessageGatewayPort,
  ) {}

  /**
   * Envoie un message à tous les participants d'une room
   */
  async sendMessageToRoom(
    roomId: string,
    message: MessageData,
  ): Promise<string | null> {
    return await this.messageGateway.sendMessageToRoom(roomId, message);
  }

  /**
   * Notifie que message a été lu
   */
  async notifyMessageRead(
    roomId: string,
    messageId: string,
    userId: string,
  ): Promise<string | null> {
    return await this.messageGateway.notifyMessageRead(
      roomId,
      messageId,
      userId,
    );
  }

  /**
   * Fait rejoindre un utilisateur à une room
   */
  async joinRoom(userId: string, roomId: string): Promise<string | null> {
    return await this.messageGateway.joinRoom(userId, roomId);
  }

  /**
   * Fait quitter un utilisateur d'une room
   */
  async leaveRoom(userId: string, roomId: string): Promise<string | null> {
    return await this.messageGateway.leaveRoom(userId, roomId);
  }

  /**
   * Notifie que l'utilisateur est en train de taper
   */
  async notifyUserTyping(
    roomId: string,
    userId: string,
    isTyping: boolean,
  ): Promise<string | null> {
    return await this.messageGateway.notifyUserTyping(roomId, userId, isTyping);
  }

  /**
   * Notifie le statut online/offline d'un utilisateur
   */
  async notifyUserOnlineStatus(
    userId: string,
    isOnline: boolean,
  ): Promise<string | null> {
    return await this.messageGateway.notifyUserOnlineStatus(userId, isOnline);
  }

  /**
   * Notifie qu'une nouvelle room a été créée
   */
  async notifyRoomCreated(roomData: RoomData): Promise<string | null> {
    return await this.messageGateway.notifyRoomCreated(roomData);
  }

  /**
   * Notifie qu'une room a été mise à jour
   */
  async notifyRoomUpdated(roomData: RoomData): Promise<string | null> {
    return await this.messageGateway.notifyRoomUpdated(roomData);
  }

  /**
   * Récupère la liste des utilisateurs connectés dans une room
   */
  async getConnectedUsersInRoom(roomId: string): Promise<string[]> {
    return await this.messageGateway.getConnectedUsersInRoom(roomId);
  }

  /**
   * Vérifie si un utilisateur est connecté
   */
  async getUserConnectionStatus(userId: string): Promise<boolean> {
    return await this.messageGateway.getUserConnectionStatus(userId);
  }
}
