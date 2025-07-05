// import { IQuery, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
// import { Inject } from '@nestjs/common';
// import { Result } from '@/shared/result';
// import {
//   PROJECT_ROLE_REPOSITORY_PORT,
//   ProjectRoleRepositoryPort,
// } from '../ports/project-role.repository.port';
// import {
//   PROJECT_REPOSITORY_PORT,
//   ProjectRepositoryPort,
// } from '@/contexts/project/use-cases/ports/project.repository.port';
// import { ProjectRole } from '../../domain/project-role.entity';

// export class GetProjectRoleByIdQuery implements IQuery {
//   constructor(
//     public readonly projectId: string,
//     public readonly roleId: string,
//   ) {}
// }

// @QueryHandler(GetProjectRoleByIdQuery)
// export class GetProjectRoleByIdQueryHandler
//   implements IQueryHandler<GetProjectRoleByIdQuery>
// {
//   constructor(
//     @Inject(PROJECT_ROLE_REPOSITORY_PORT)
//     private readonly projectRoleRepo: ProjectRoleRepositoryPort,
//     @Inject(PROJECT_REPOSITORY_PORT)
//     private readonly projectRepo: ProjectRepositoryPort,
//   ) {}

//   async execute(
//     query: GetProjectRoleByIdQuery,
//   ): Promise<Result<ProjectRole, string>> {
//     const { projectId, roleId } = query;

//     // Vérifier que le projet existe
//     const projectResult = await this.projectRepo.findById(projectId);
//     if (!projectResult.success) {
//       return Result.fail('Project not found');
//     }

//     // Récupérer le rôle spécifique
//     const roleResult = await this.projectRoleRepo.findById(roleId);
//     if (!roleResult.success) {
//       return Result.fail(roleResult.error);
//     }

//     return Result.ok(roleResult.value);
//   }
// }
