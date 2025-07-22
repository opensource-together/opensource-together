import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { CommandBus } from '@nestjs/cqrs';
import { CreateNotificationCommand } from '../../../../../notification/use-cases/commands/create-notification.command';

/**
 * Listener pour les notifications liées aux rôles de projet.
 * Transforme les événements métier du contexte project-role en notifications.
 */
@Injectable()
export class ProjectRoleNotificationsListener {
  constructor(private readonly commandBus: CommandBus) {}

  /**
   * Notification lors de l'assignation d'un rôle
   */
  @OnEvent('project.role.assigned')
  async handleRoleAssigned(event: {
    userId: string;
    projectId: string;
    projectTitle: string;
    roleName: string;
    assignedBy: string;
  }) {
    const command = new CreateNotificationCommand({
      receiverId: event.userId,
      senderId: event.assignedBy,
      type: 'project.role.assigned',
      payload: {
        projectId: event.projectId,
        projectTitle: event.projectTitle,
        roleName: event.roleName,
        assignedBy: event.assignedBy,
        message: `Vous avez été assigné au rôle "${event.roleName}" sur le projet "${event.projectTitle}".`,
      },
      channels: ['realtime'],
    });

    await this.commandBus.execute(command);
  }

  /**
   * Notification lors de la création d'une candidature
   */
  @OnEvent('project.role.application.created')
  async handleApplicationCreated(event: {
    projectOwnerId: string;
    applicantId: string;
    applicantName: string;
    projectId: string;
    projectTitle: string;
    roleName: string;
  }) {
    const command = new CreateNotificationCommand({
      receiverId: event.projectOwnerId,
      senderId: event.applicantId,
      type: 'project.role.application.created',
      payload: {
        applicantId: event.applicantId,
        applicantName: event.applicantName,
        projectId: event.projectId,
        projectTitle: event.projectTitle,
        roleName: event.roleName,
        message: `${event.applicantName} a postulé pour le rôle "${event.roleName}" sur votre projet "${event.projectTitle}".`,
      },
      channels: ['realtime'],
    });

    await this.commandBus.execute(command);
  }

  /**
   * Notification lors de l'acceptation d'une candidature
   */
  @OnEvent('project.role.application.accepted')
  async handleApplicationAccepted(event: {
    applicantId: string;
    projectId: string;
    projectTitle: string;
    roleName: string;
  }) {
    const command = new CreateNotificationCommand({
      receiverId: event.applicantId,
      senderId: event.applicantId,
      type: 'project.role.application.accepted',
      payload: {
        projectId: event.projectId,
        projectTitle: event.projectTitle,
        roleName: event.roleName,
        message: `Votre candidature pour le rôle "${event.roleName}" sur le projet "${event.projectTitle}" a été acceptée !`,
      },
      channels: ['realtime'],
    });

    await this.commandBus.execute(command);
  }

  /**
   * Notification lors du refus d'une candidature
   */
  @OnEvent('project.role.application.rejected')
  async handleApplicationRejected(event: {
    applicantId: string;
    projectId: string;
    projectTitle: string;
    roleName: string;
  }) {
    const command = new CreateNotificationCommand({
      receiverId: event.applicantId,
      senderId: event.applicantId,
      type: 'project.role.application.rejected',
      payload: {
        projectId: event.projectId,
        projectTitle: event.projectTitle,
        roleName: event.roleName,
        message: `Votre candidature pour le rôle "${event.roleName}" sur le projet "${event.projectTitle}" n'a pas été retenue.`,
      },
      channels: ['realtime'],
    });

    await this.commandBus.execute(command);
  }
}
