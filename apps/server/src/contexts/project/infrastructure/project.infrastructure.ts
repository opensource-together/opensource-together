import { Module } from '@nestjs/common';
import { PROJECT_REPOSITORY_PORT } from '@/contexts/project/use-cases/ports/project.repository.port';
import { PrismaService } from '@/orm/prisma/prisma.service';
import { projectUseCases } from '@/contexts/project/use-cases/project.use-cases';
import { PROJECT_ROLE_REPOSITORY_PORT } from '@/contexts/project-role/use-cases/ports/project-role.repository.port';
import { InMemoryProjectRepository } from '@/contexts/project/infrastructure/repositories/mock.project.repository';
import { InMemoryProjectRoleRepository } from '@/contexts/project-role/infrastructure/repositories/mock.project-role.repository';

@Module({
  imports: [],
  providers: [
    PrismaService,
    {
      provide: PROJECT_REPOSITORY_PORT,
      useClass: InMemoryProjectRepository,
    },
    {
      provide: PROJECT_ROLE_REPOSITORY_PORT,
      useClass: InMemoryProjectRoleRepository,
    },
    ...projectUseCases,
  ],
  controllers: [],
  exports: [...projectUseCases],
})
export class ProjectInfrastructure {}
