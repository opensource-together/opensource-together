import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { RealtimeMessageNotifierAdapter } from '../services/realtime-message-notifier.adapter';
import {
  MESSAGE_SERVICE_PORT,
  MessageServicePort,
} from '../../use-cases/ports/message.service.port';
import { Inject } from '@nestjs/common';

/**
 * 🎧 Listener pour les événements de messagerie.
 * Connecte les événements métier aux notifications temps réel.
 *
 * 📋 Principe : Écouter les événements émis par les commands et déclencher les actions WebSocket.
 */
@Injectable()
export class MessageEventsListener {
  constructor(
    private readonly realtimeAdapter: RealtimeMessageNotifierAdapter,
    @Inject(MESSAGE_SERVICE_PORT)
    private readonly messageService: MessageServicePort,
  ) {}

  /**
   * 📨 Message envoyé - diffuser en temps réel
   */
  @OnEvent('message.sent')
  async handleMessageSent(event: {
    messageId: string;
    roomId: string;
    senderId: string;
    content: string;
    messageType: string;
    createdAt: Date;
    replyToId?: string;
  }) {
    try {
      // Récupérer le message complet depuis le service
      const messageResult = await this.messageService.getMessageById(
        event.messageId,
      );

      if (messageResult.success && messageResult.value) {
        // Diffuser le message à tous les participants de la room
        await this.realtimeAdapter.sendMessageToRoom(
          event.roomId,
          messageResult.value,
        );
      }
    } catch (error) {
      console.error('Error handling message.sent event:', error);
    }
  }

  /**
   * 👁️ Message lu - notifier les autres participants
   */
  @OnEvent('message.read')
  async handleMessageRead(event: {
    messageId: string;
    roomId: string;
    userId: string;
    readAt: Date;
  }) {
    try {
      // Notifier les autres participants que le message a été lu
      await this.realtimeAdapter.notifyMessageRead(
        event.roomId,
        event.messageId,
        event.userId,
      );
    } catch (error) {
      console.error('Error handling message.read event:', error);
    }
  }

  /**
   * 🏠 Room créée - notifier les participants
   */
  @OnEvent('room.created')
  async handleRoomCreated(event: {
    roomId: string;
    participants: string[];
    roomType: string;
    name?: string;
    createdAt: Date;
  }) {
    try {
      // Récupérer les détails complets de la room
      const roomResult = await this.messageService.getRoomById(
        event.roomId,
        event.participants[0],
      );

      if (roomResult.success && roomResult.value) {
        // Notifier tous les participants de la création de la room
        await this.realtimeAdapter.notifyRoomCreated(roomResult.value);
      }
    } catch (error) {
      console.error('Error handling room.created event:', error);
    }
  }

  /**
   * 👥 Participants ont rejoint la room
   */
  @OnEvent('room.participants.joined')
  async handleRoomParticipantsJoined(event: {
    roomId: string;
    participants: string[];
  }) {
    try {
      // Faire rejoindre chaque participant à la room WebSocket
      for (const userId of event.participants) {
        await this.realtimeAdapter.joinRoom(userId, event.roomId);
      }
    } catch (error) {
      console.error('Error handling room.participants.joined event:', error);
    }
  }

  /**
   * 📅 Activité de room mise à jour (lastMessageAt)
   */
  @OnEvent('room.message.added')
  async handleRoomMessageAdded(event: {
    roomId: string;
    messageId: string;
    senderId: string;
  }) {
    try {
      // Récupérer les détails de la room mise à jour
      const roomResult = await this.messageService.getRoomById(
        event.roomId,
        event.senderId,
      );

      if (roomResult.success && roomResult.value) {
        // Notifier la mise à jour de la room (pour trier les rooms par activité)
        await this.realtimeAdapter.notifyRoomUpdated(roomResult.value);
      }
    } catch (error) {
      console.error('Error handling room.message.added event:', error);
    }
  }

  /**
   * 🔔 Événement générique pour toute notification de messagerie
   * Peut être utilisé pour envoyer des notifications push, email, etc.
   */
  @OnEvent('messaging.notification')
  async handleMessagingNotification(event: {
    type: 'new_message' | 'message_read' | 'room_created' | 'user_joined';
    userId: string;
    roomId: string;
    data: Record<string, unknown>;
  }) {
    try {
      // TODO: Intégrer avec le système de notifications général
      // Par exemple, envoyer des notifications push pour les messages
      // quand l'utilisateur n'est pas connecté

      console.log(`Messaging notification: ${event.type}`, {
        userId: event.userId,
        roomId: event.roomId,
        data: event.data,
      });
    } catch (error) {
      console.error('Error handling messaging.notification event:', error);
    }
  }

  /**
   * 🚨 Gestion des erreurs de messagerie
   */
  @OnEvent('messaging.error')
  async handleMessagingError(event: {
    error: string;
    context: Record<string, unknown>;
    userId?: string;
    roomId?: string;
  }) {
    try {
      console.error('Messaging error:', event.error, event.context);

      // TODO: Implémenter des actions de récupération d'erreur
      // - Logger l'erreur
      // - Notifier les administrateurs si critique
      // - Retry automatique si applicable
    } catch (error) {
      console.error('Error handling messaging.error event:', error);
    }
  }
}
