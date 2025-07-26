import { Module } from '@nestjs/common';
import { PROJECT_KEY_FEATURE_REPOSITORY_PORT } from '@/contexts/project/bounded-contexts/project-key-feature/use-cases/ports/project-key-feature.repository.port';
import { PrismaProjectKeyFeatureRepository } from '@/contexts/project/bounded-contexts/project-key-feature/infrastructure/repositories/prisma.project-key-feature.repository';
import { ProjectKeyFeatureController } from '@/contexts/project/bounded-contexts/project-key-feature/infrastructure/controllers/project-key-feature.controller';
import { UserProjectKeyFeatureController } from '@/contexts/project/bounded-contexts/project-key-feature/infrastructure/controllers/user-project-key-feature.controller';
import { projectKeyFeaturesUseCases } from '@/contexts/project/bounded-contexts/project-key-feature/use-cases/project-key-feature.use-cases';
import { PersistenceInfrastructure } from '@/persistence/persistence.infrastructure';
import { PROJECT_REPOSITORY_PORT } from '@/contexts/project/use-cases/ports/project.repository.port';
import { PrismaProjectRepository } from '@/contexts/project/infrastructure/repositories/prisma.project.repository';

@Module({
  imports: [PersistenceInfrastructure],
  providers: [
    {
      provide: PROJECT_KEY_FEATURE_REPOSITORY_PORT,
      useClass: PrismaProjectKeyFeatureRepository,
    },
    {
      provide: PROJECT_REPOSITORY_PORT,
      useClass: PrismaProjectRepository,
    },
    ...projectKeyFeaturesUseCases,
  ],
  controllers: [ProjectKeyFeatureController, UserProjectKeyFeatureController],
  exports: [PROJECT_KEY_FEATURE_REPOSITORY_PORT],
})
export class ProjectKeyFeatureInfrastructure {}
