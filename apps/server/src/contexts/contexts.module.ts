import { Module } from '@nestjs/common';
import { UserInfrastructure } from './user/infrastructure/user.infrastructure';
import { ProjectInfrastructure } from './project/infrastructure/project.infrastructure';
import { ProfileInfrastructure } from './profile/infrastructure/profile.infrastructure';
import { TechStackInfrastructure } from './techstack/infrastructure/techstack.infrastructure';
import { ProjectRoleInfrastructure } from './project/bounded-contexts/project-role/infrastructure/project-role.infrastructure';
import { GithubInfrastructure } from './github/infrastructure/github.infrastructure';
import { CategoryInfrastructure } from './category/infrastructure/category.infrastructure';
import { NotificationInfrastructure } from './notification/infrastructure/notification.infrastructure';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ProjectRoleApplicationInfrastructure } from './project/bounded-contexts/project-role-application/infrastructure/project-role-application.infrastructure';
import { MailingInfrastructure } from '@/mailing/infrastructure/mailing.infrastructure';
import { ProjectKeyFeatureInfrastructure } from './project/bounded-contexts/project-key-feature/infrastructure/project-key-feature.infrastructure';

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
    EventEmitterModule.forRoot(),
    MailingInfrastructure,
    ProjectKeyFeatureInfrastructure,
    NotificationInfrastructure,
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
    ProjectKeyFeatureInfrastructure,
    NotificationInfrastructure,
  ],
})
export class ContextsModule {}
