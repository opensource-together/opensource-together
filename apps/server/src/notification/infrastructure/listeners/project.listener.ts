import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { CommandBus } from '@nestjs/cqrs';
import { CreateNotificationCommand } from '../../use-cases/commands/create-notification.command';

/**
 * Listener pour les événements liés aux projets.
 * Transforme les DomainEvents en notifications.
 *
 * Principe : Quand un événement métier se produit (ex: "project.role.assigned"),
 * ce listener le "capture" et crée une notification appropriée.
 */
@Injectable()
export class ProjectListener {
  constructor(private readonly commandBus: CommandBus) {}

  /**
   * Écoute l'événement : Un rôle a été assigné à un utilisateur sur un projet.
   * Déclenche une notification vers l'utilisateur concerné.
   */
  @OnEvent('project.role.assigned')
  async handleProjectRoleAssigned(event: {
    userId: string;
    projectId: string;
    projectTitle: string;
    roleName: string;
    assignedBy: string;
  }) {
    // Créer une notification pour l'utilisateur qui a reçu le rôle
    const command = new CreateNotificationCommand({
      userId: event.userId,
      type: 'project.role.assigned',
      payload: {
        projectId: event.projectId,
        projectTitle: event.projectTitle,
        roleName: event.roleName,
        assignedBy: event.assignedBy,
        message: `Vous avez été assigné au rôle "${event.roleName}" sur le projet "${event.projectTitle}".`,
      },
      channels: ['realtime'], // Notification temps réel uniquement
    });

    await this.commandBus.execute(command);
  }

  /**
   * Écoute l'événement : Un utilisateur a postulé pour un rôle.
   * Notifie le propriétaire du projet.
   */
  @OnEvent('project.role.application.created')
  async handleProjectRoleApplication(event: {
    projectOwnerId: string;
    applicantId: string;
    applicantName: string;
    projectId: string;
    projectTitle: string;
    roleName: string;
  }) {
    // Notifier le propriétaire du projet
    const command = new CreateNotificationCommand({
      userId: event.projectOwnerId,
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
   * Écoute l'événement : Un nouveau projet a été créé.
   * Peut servir à notifier les admins ou créer des notifications système.
   */
  @OnEvent('project.created')
  async handleProjectCreated(event: {
    projectId: string;
    projectTitle: string;
    ownerId: string;
    ownerName: string;
  }) {
    // Notification de confirmation pour le créateur
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
}
