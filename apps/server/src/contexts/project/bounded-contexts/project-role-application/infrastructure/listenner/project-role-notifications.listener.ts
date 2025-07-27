import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { CommandBus } from '@nestjs/cqrs';
import { CreateNotificationCommand } from '../../../../../notification/use-cases/commands/create-notification.command';
import {
  ApplyProjectRequestAcceptedNotification,
  ApplyProjectRequestCreatedNotification,
  ApplyProjectRequestRejectedNotification,
  ProjectRoleApplicationCreatedEvent,
} from '../../../../../notification/notification.interface';

/**
 * Listener pour les événements liés aux projets.
 * Transforme les DomainEvents en notifications.
 *
 * Principe : Quand un événement métier se produit (ex: "project.role.assigned"),
 * ce listener le "capture" et crée une notification appropriée.
 */
@Injectable()
export class ProjectRoleApplicationListener {
  constructor(private readonly commandBus: CommandBus) {}

  /**
   * Écoute l'événement : Un utilisateur a postulé pour un rôle.
   * Notifie le propriétaire du projet.
   */
  @OnEvent('project.role.application.created')
  async handleProjectRoleApplication(
    event: ProjectRoleApplicationCreatedEvent,
  ) {
    // Créer la notification de type ApplyProjectRequestCreatedNotification
    const notificationData: ApplyProjectRequestCreatedNotification = {
      object: 'Un utilisateur a postulé pour un rôle',
      message: event.message,
      type: 'project.role.application.created',
      appplicationId: event.applicationId,
      projectRoleId: event.projectRole.id,
      projectRoleTitle: event.projectRole.title,
      project: {
        id: event.projectId,
        title: event.projectTitle,
        shortDescription: event.projectShortDescription,
        image: event.projectImage,
        author: event.projectAuthor,
      },
      projectRole: event.projectRole,
      status: 'PENDING',
      selectedKeyFeatures: event.selectedKeyFeatures,
      selectedProjectGoals: event.selectedProjectGoals,
      appliedAt: new Date(),
      motivationLetter: event.motivationLetter,
      userProfile: {
        id: event.applicantId,
        name: event.applicantName,
        avatarUrl: undefined, // Sera récupéré côté frontend si nécessaire
      },
    };

    // Notifier le propriétaire du projet
    const ownerNotificationCommand = new CreateNotificationCommand({
      object: 'Un utilisateur a postulé pour un rôle',
      receiverId: event.projectOwnerId,
      senderId: event.applicantId,
      type: 'project.role.application.created',
      payload: JSON.parse(JSON.stringify(notificationData)),
      channels: ['realtime'],
    });

    await this.commandBus.execute(ownerNotificationCommand);
  }

  @OnEvent('project.role.application.accepted')
  async handlePorjectRoleApplicationAccepted(
    event: ApplyProjectRequestAcceptedNotification,
  ) {
    const command = new CreateNotificationCommand({
      object: 'Votre candidature a été acceptée',
      receiverId: event.userProfile.id,
      senderId: event.project.author.userId,
      type: event.type,
      payload: JSON.parse(JSON.stringify(event)),
      channels: ['realtime'],
    });

    await this.commandBus.execute(command);
  }

  /**
   * Écoute l'événement : Un utilisateur a rejeté une candidature.
   * Notifie l'utilisateur qui a postulé.
   */
  @OnEvent('project.role.application.rejected')
  async handleProjectRoleApplicationRejected(
    event: ApplyProjectRequestRejectedNotification,
  ) {
    const command = new CreateNotificationCommand({
      object: 'Votre candidature a été rejetée',
      receiverId: event.userProfile.id,
      senderId: event.project.author.userId,
      type: event.type,
      payload: JSON.parse(JSON.stringify(event)),
      channels: ['realtime'],
    });

    await this.commandBus.execute(command);
  }
}
