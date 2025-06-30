// import { Module } from '@nestjs/common';
// import { PROJECT_REPOSITORY_PORT } from '@/contexts/project/use-cases/ports/project.repository.port';
// import { PrismaProjectRepository } from '@/contexts/project/infrastructure/repositories/prisma.project.repository';
// import { projectRoleCommandsContainer } from '@/application/projectRole/commands/projectRole.command';
// import { ProjectController } from './controllers/project.controller';
// import { PrismaService } from '@/orm/prisma/prisma.service';
// import { projectUseCases } from '@/contexts/project/use-cases/project.use-cases';
// import { PROJECT_ROLE_REPOSITORY_PORT } from '../use-cases/ports/projectRole.repository.port';
// import { PrismaProjectRoleRepository } from '@/infrastructures/repositories/projectRoles/prisma.projectRole.repository';
// @Module({
//   imports: [],
//   providers: [
//     PrismaService,
//     {
//       provide: PROJECT_REPOSITORY_PORT,
//       useClass: PrismaProjectRepository,
//     },
//     {
//       provide: PROJECT_ROLE_REPOSITORY_PORT,
//       useClass: PrismaProjectRoleRepository,
//     },
//     ...projectUseCases,
//     ...projectRoleCommandsContainer,
//   ],
//   controllers: [ProjectController],
//   exports: [...projectUseCases, ...projectRoleCommandsContainer],
// })
// export class ProjectInfrastructure {}
