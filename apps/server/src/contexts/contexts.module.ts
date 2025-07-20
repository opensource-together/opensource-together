import { Module } from '@nestjs/common';
import { UserInfrastructure } from './user/infrastructure/user.infrastructure';
import { ProjectInfrastructure } from './project/infrastructure/project.infrastructure';
import { ProfileInfrastructure } from './profile/infrastructure/profile.infrastructure';
import { TechStackInfrastructure } from './techstack/infrastructure/techstack.infrastructure';
import { ProjectRoleInfrastructure } from './project-role/infrastructure/project-role.infrastructure';
import { GithubInfrastructure } from './github/infrastructure/github.infrastructure';
import { CategoryInfrastructure } from './category/infrastructure/category.infrastructure';
import { ProjectRoleApplicationInfrastructure } from './project-role-application/infrastructure/project-role-application.infrastructure';
import { NotificationInfrastructure } from './notification/infrastructure/notification.infrastructure';
import { MailingModule } from '@/mailing/infrastructure/mailing.infrastructure';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [
    UserInfrastructure,
    ProjectInfrastructure,
    ProjectRoleInfrastructure,
    ProfileInfrastructure,
    TechStackInfrastructure,
    GithubInfrastructure,
    CategoryInfrastructure,
    ProjectRoleApplicationInfrastructure,
    NotificationInfrastructure,
    MailingModule,
    EventEmitterModule.forRoot(),
  ],
  exports: [
    UserInfrastructure,
    ProjectInfrastructure,
    ProjectRoleInfrastructure,
    ProfileInfrastructure,
    TechStackInfrastructure,
    GithubInfrastructure,
    CategoryInfrastructure,
    ProjectRoleApplicationInfrastructure,
    NotificationInfrastructure,
  ],
})
export class ContextsModule {}
