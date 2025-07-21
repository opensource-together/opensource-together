import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { CommandBus } from '@nestjs/cqrs';
import { CreateNotificationCommand } from '../../../notification/use-cases/commands/create-notification.command';

/**
 * Listener pour les notifications liées aux utilisateurs.
 * Transforme les événements métier du contexte user en notifications.
 */
@Injectable()
export class UserNotificationsListener {
  constructor(private readonly commandBus: CommandBus) {}

  /**
   * Notification de bienvenue lors de l'inscription
   */
  @OnEvent('user.registered')
  async handleUserRegistered(event: {
    userId: string;
    email: string;
    username: string;
  }) {
    const command = new CreateNotificationCommand({
      userId: event.userId,
      type: 'user.registered',
      payload: {
        email: event.email,
        username: event.username,
        message: `Bienvenue ${event.username} ! Votre compte a été créé avec succès.`,
      },
      channels: ['realtime'],
    });

    await this.commandBus.execute(command);
  }

  /**
   * Notification lors de la mise à jour du profil
   */
  @OnEvent('user.profile.updated')
  async handleProfileUpdated(event: {
    userId: string;
    updatedFields: string[];
  }) {
    const command = new CreateNotificationCommand({
      userId: event.userId,
      type: 'user.profile.updated',
      payload: {
        updatedFields: event.updatedFields,
        message: `Votre profil a été mis à jour avec succès.`,
      },
      channels: ['realtime'],
    });

    await this.commandBus.execute(command);
  }

  /**
   * Notification lors du changement de mot de passe
   */
  @OnEvent('user.password.changed')
  async handlePasswordChanged(event: {
    userId: string;
    email: string;
  }) {
    const command = new CreateNotificationCommand({
      userId: event.userId,
      type: 'user.password.changed',
      payload: {
        email: event.email,
        message: `Votre mot de passe a été modifié avec succès.`,
      },
      channels: ['realtime'],
    });

    await this.commandBus.execute(command);
  }

  /**
   * Notification lors de la connexion depuis un nouvel appareil
   */
  @OnEvent('user.login.new-device')
  async handleNewDeviceLogin(event: {
    userId: string;
    deviceInfo: string;
    location: string;
  }) {
    const command = new CreateNotificationCommand({
      userId: event.userId,
      type: 'user.login.new-device',
      payload: {
        deviceInfo: event.deviceInfo,
        location: event.location,
        message: `Nouvelle connexion détectée depuis ${event.deviceInfo} (${event.location}).`,
      },
      channels: ['realtime'],
    });

    await this.commandBus.execute(command);
  }
} 