// import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
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
// import { Project } from '@/contexts/project/domain/project.entity';

// export class DeleteProjectRoleCommand implements ICommand {
//   constructor(
//     public readonly props: {
//       projectId: string;
//       roleId: string;
//       userId: string;
//     },
//   ) {}
// }

// @CommandHandler(DeleteProjectRoleCommand)
// export class DeleteProjectRoleCommandHandler
//   implements ICommandHandler<DeleteProjectRoleCommand>
// {
//   constructor(
//     @Inject(PROJECT_ROLE_REPOSITORY_PORT)
//     private readonly projectRoleRepo: ProjectRoleRepositoryPort,
//     @Inject(PROJECT_REPOSITORY_PORT)
//     private readonly projectRepo: ProjectRepositoryPort,
//   ) {}

//   async execute(
//     command: DeleteProjectRoleCommand,
//   ): Promise<Result<boolean, string>> {
//     const { projectId, roleId, userId } = command.props;

//     // Vérifier que le projet existe et récupérer le projet
//     const projectExistsResult: Result<Project, string> =
//       await this.projectRepo.findById(projectId);
//     if (!projectExistsResult.success) {
//       return Result.fail('Project not found');
//     }

//     const project: Project = projectExistsResult.value;

//     // Vérifier que l'utilisateur peut modifier les rôles du projet
//     if (!project.canUserModifyRoles(userId)) {
//       return Result.fail(
//         'You are not allowed to delete roles from this project',
//       );
//     }

//     // Vérifier que le rôle existe dans ce projet
//     const roleExistsResult =
//       await this.projectRoleRepo.findByProjectIdAndRoleId(projectId, roleId);
//     if (!roleExistsResult.success) {
//       return Result.fail('Project role not found');
//     }

//     // Supprimer le rôle
//     const deleteResult = await this.projectRoleRepo.delete(roleId);
//     if (!deleteResult.success) {
//       return Result.fail(deleteResult.error);
//     }

//     return Result.ok(deleteResult.value);
//   }
// }
