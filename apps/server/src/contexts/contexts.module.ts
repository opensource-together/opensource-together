import { Module } from '@nestjs/common';
import { UserInfrastructure } from './user/infrastructure/user.infrastructure';
import { ProjectInfrastructure } from './project/infrastructure/project.infrastructure';
import { TechStackInfrastructure } from './techstack/infrastructure/techstack.infrastructure';
import { ProjectRoleInfrastructure } from './project/bounded-contexts/project-role/infrastructure/project-role.infrastructure';
import { GithubInfrastructure } from './github/infrastructure/github.infrastructure';
import { CategoryInfrastructure } from './category/infrastructure/category.infrastructure';
import { ProjectRoleApplicationInfrastructure } from './project/bounded-contexts/project-role-application/infrastructure/project-role-application.infrastructure';
import { MailingInfrastructure } from '@/mailing/infrastructure/mailing.infrastructure';
import { ProjectKeyFeatureInfrastructure } from './project/bounded-contexts/project-key-feature/infrastructure/project-key-feature.infrastructure';

@Module({
  imports: [
    UserInfrastructure,
    ProjectInfrastructure,
    ProjectRoleInfrastructure,
    TechStackInfrastructure,
    GithubInfrastructure,
    CategoryInfrastructure,
    ProjectRoleApplicationInfrastructure,
    MailingInfrastructure,
    ProjectKeyFeatureInfrastructure,
  ],
  exports: [
    UserInfrastructure,
    ProjectInfrastructure,
    ProjectRoleInfrastructure,
    TechStackInfrastructure,
    GithubInfrastructure,
    CategoryInfrastructure,
    ProjectRoleApplicationInfrastructure,
    ProjectKeyFeatureInfrastructure,
  ],
})
export class ContextsModule {}
