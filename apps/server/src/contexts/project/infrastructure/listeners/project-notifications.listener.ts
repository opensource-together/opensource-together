import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { CommandBus } from '@nestjs/cqrs';
import { CreateNotificationCommand } from '../../../notification/use-cases/commands/create-notification.command';

/**
 * Listener pour les notifications liées aux projets.
 * Transforme les événements métier du contexte project en notifications.
 *
 * Principe : Chaque contexte a son propre listener pour ses notifications spécifiques.
 */
@Injectable()
export class ProjectNotificationsListener {
  constructor(private readonly commandBus: CommandBus) {}

  /**
   * Notification de confirmation lors de la création d'un projet
   */
  @OnEvent('project.created')
  async handleProjectCreated(event: {
    projectId: string;
    projectTitle: string;
    ownerId: string;
    ownerName: string;
  }) {
    const command = new CreateNotificationCommand({
      userId: event.ownerId,
      type: 'project.created',
      payload: {
        projectId: event.projectId,
        projectTitle: event.projectTitle,
        message: `Votre projet "${event.projectTitle}" a été créé avec succès !`,
      },
      channels: ['realtime'],
    });

    await this.commandBus.execute(command);
  }

  /**
   * Notification lors de la mise à jour d'un projet
   */
  @OnEvent('project.updated')
  async handleProjectUpdated(event: {
    projectId: string;
    projectTitle: string;
    ownerId: string;
    updatedBy: string;
    updatedFields: string[];
  }) {
    const command = new CreateNotificationCommand({
      userId: event.ownerId,
      type: 'project.updated',
      payload: {
        projectId: event.projectId,
        projectTitle: event.projectTitle,
        updatedBy: event.updatedBy,
        updatedFields: event.updatedFields,
        message: `Le projet "${event.projectTitle}" a été mis à jour.`,
      },
      channels: ['realtime'],
    });

    await this.commandBus.execute(command);
  }

  /**
   * Notification lors de la suppression d'un projet
   */
  @OnEvent('project.deleted')
  async handleProjectDeleted(event: {
    projectId: string;
    projectTitle: string;
    ownerId: string;
  }) {
    const command = new CreateNotificationCommand({
      userId: event.ownerId,
      type: 'project.deleted',
      payload: {
        projectId: event.projectId,
        projectTitle: event.projectTitle,
        message: `Le projet "${event.projectTitle}" a été supprimé.`,
      },
      channels: ['realtime'],
    });

    await this.commandBus.execute(command);
  }
}
