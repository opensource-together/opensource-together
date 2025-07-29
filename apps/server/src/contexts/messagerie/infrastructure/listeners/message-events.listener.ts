import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { RealtimeMessageNotifierAdapter } from '../services/realtime-message-notifier.adapter';
import {
  MESSAGE_SERVICE_PORT,
  MessageServicePort,
} from '../../use-cases/ports/message.service.port';
import { Inject } from '@nestjs/common';
import {
  NOTIFICATION_SERVICE_PORT,
  NotificationServicePort,
  SendNotificationPayload,
} from '@/contexts/notification/use-cases/ports/notification.service.port';

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
    @Inject(NOTIFICATION_SERVICE_PORT)
    private readonly notificationService: NotificationServicePort,
  ) {}

  /**
   * 📨 Message envoyé - diffuser en temps réel et notifier les participants
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
        await this.realtimeAdapter.sendMessageToChat(
          event.roomId,
          messageResult.value,
        );

        // 📧 Créer des notifications pour les participants
        const roomResult = await this.messageService.getRoomById(
          event.roomId,
          event.senderId,
        );

        if (roomResult.success && roomResult.value) {
          const roomData = roomResult.value;

          // Obtenir les participants directement depuis RoomData
          const participants = roomData.participants;

          // Créer une notification pour chaque participant (sauf l'expéditeur)
          for (const participantId of participants) {
            if (participantId !== event.senderId) {
              const notificationPayload: SendNotificationPayload = {
                object: 'Nouveau message reçu !',
                receiverId: participantId,
                senderId: event.senderId,
                type: 'message.received',
                payload: {
                  messageId: event.messageId,
                  roomId: event.roomId,
                  content: event.content,
                  messageType: event.messageType,
                  roomName: roomData.name || 'Message privé',
                },
                channels: ['realtime'],
              };

              // Envoyer la notification
              const notificationResult =
                await this.notificationService.sendNotification(
                  notificationPayload,
                );

              if (!notificationResult.success) {
                console.error(
                  `❌ Erreur envoi notification à ${participantId}:`,
                  notificationResult.error,
                );
              } else {
                console.log(
                  `✅ Notification envoyée à ${participantId} pour message ${event.messageId}`,
                );
              }
            }
          }
        }
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
        this.realtimeAdapter.notifyChatCreated(roomResult.value);
      }
    } catch (error) {
      console.error('Error handling room.created event:', error);
    }
  }

  /**
   * 👥 Participants ont rejoint la room
   */
  @OnEvent('room.participants.joined')
  handleRoomParticipantsJoined(event: {
    roomId: string;
    participants: string[];
  }) {
    try {
      // Faire rejoindre chaque participant à la room WebSocket
      for (const userId of event.participants) {
        this.realtimeAdapter.joinChat(userId, event.roomId);
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
        // await this.realtimeAdapter.notifyChatUpdated(roomResult.value);
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
  handleMessagingNotification(event: {
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
  handleMessagingError(event: {
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
