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
// import { ProjectRole } from '../../domain/project-role.entity';
// import { TechStack } from '@/contexts/techstack/domain/techstack.entity';

// export type UpdateProjectRoleProps = {
//   roleTitle?: string;
//   description?: string;
//   isFilled?: boolean;
//   skillSet?: TechStack[];
// };

// export class UpdateProjectRoleCommand implements ICommand {
//   constructor(
//     public readonly projectId: string,
//     public readonly roleId: string,
//     public readonly userId: string,
//     public readonly updateProps: UpdateProjectRoleProps,
//   ) {}
// }

// @CommandHandler(UpdateProjectRoleCommand)
// export class UpdateProjectRoleCommandHandler
//   implements ICommandHandler<UpdateProjectRoleCommand>
// {
//   constructor(
//     @Inject(PROJECT_ROLE_REPOSITORY_PORT)
//     private readonly projectRoleRepo: ProjectRoleRepositoryPort,
//     @Inject(PROJECT_REPOSITORY_PORT)
//     private readonly projectRepo: ProjectRepositoryPort,
//   ) {}

//   async execute(
//     command: UpdateProjectRoleCommand,
//   ): Promise<Result<ProjectRole, string>> {
//     const { projectId, roleId, userId, updateProps } = command;

//     // Vérifier que le projet existe et récupérer le projet
//     const projectResult = await this.projectRepo.findById(projectId);
//     if (!projectResult.success) {
//       return Result.fail('Project not found');
//     }

//     // Vérifier que l'utilisateur peut modifier les rôles du projet
//     if (!projectResult.value.canUserModifyRoles(userId)) {
//       return Result.fail('You are not allowed to update this project role');
//     }

//     // Récupérer le rôle existant
//     const existingRoleResult =
//       await this.projectRoleRepo.findByProjectIdAndRoleId(projectId, roleId);
//     if (!existingRoleResult.success) {
//       return Result.fail(existingRoleResult.error);
//     }
//     const existingRole = existingRoleResult.value;

//     // Vérifier qu'un autre rôle avec le même titre n'existe pas déjà (si le titre change)
//     if (
//       updateProps.roleTitle &&
//       updateProps.roleTitle !== existingRole.toPrimitive().title
//     ) {
//       const roleExistsResult =
//         await this.projectRoleRepo.existsByProjectIdAndRoleTitle(
//           projectId,
//           updateProps.roleTitle,
//         );
//       if (!roleExistsResult.success) {
//         return Result.fail(roleExistsResult.error);
//       }
//       if (roleExistsResult.value) {
//         return Result.fail(
//           'A role with this title already exists in this project',
//         );
//       }
//     }

//     // Mettre à jour l'entité
//     const updateResult = existingRole.updateRole(updateProps);
//     if (!updateResult.success) {
//       return Result.fail(
//         typeof updateResult.error === 'string'
//           ? updateResult.error
//           : JSON.stringify(updateResult.error),
//       );
//     }

//     // Sauvegarder les modifications
//     const saveResult = await this.projectRoleRepo.update(existingRole);
//     if (!saveResult.success) {
//       return Result.fail(saveResult.error);
//     }

//     return Result.ok(saveResult.value);
//   }
// }
