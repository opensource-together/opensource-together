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
  async sendMessageToChat(
    roomId: string,
    message: MessageData,
  ): Promise<string | null> {
    return this.messageGateway.sendMessageToChat(roomId, message);
  }

  /**
   * Notifie que message a été lu
   */
  async notifyMessageRead(
    roomId: string,
    messageId: string,
    userId: string,
  ): Promise<string | null> {
    return this.messageGateway.notifyMessageRead(roomId, messageId, userId);
  }

  /**
   * Fait rejoindre un utilisateur à une room
   */
  joinChat(userId: string, roomId: string): string | null {
    return this.messageGateway.joinChat(userId, roomId);
  }

  /**
   * Fait quitter un utilisateur d'une room
   */
  leaveChat(userId: string, roomId: string): string | null {
    return this.messageGateway.leaveChat(userId, roomId);
  }

  /**
   * Notifie que l'utilisateur est en train de taper
   */
  async notifyUserTyping(
    roomId: string,
    userId: string,
    isTyping: boolean,
  ): Promise<string | null> {
    return this.messageGateway.notifyUserTyping(roomId, userId, isTyping);
  }

  /**
   * Notifie le statut online/offline d'un utilisateur
   */
  async notifyUserOnlineStatus(
    userId: string,
    isOnline: boolean,
  ): Promise<string | null> {
    return this.messageGateway.notifyUserOnlineStatus(userId, isOnline);
  }

  /**
   * Notifie qu'une nouvelle room a été créée
   */
  notifyChatCreated(roomData: RoomData): string | null {
    return this.messageGateway.notifyChatCreated(roomData);
  }

  /**
   * Récupère la liste des utilisateurs connectés dans une room
   */
  getConnectedUsersInChat(): string[] {
    return [];
  }

  /**
   * Vérifie si un utilisateur est connecté
   */
  getUserConnectionStatus(userId: string): boolean {
    return this.messageGateway.getUserConnectionStatus(userId);
  }
}
