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
// import {
//   ProjectRole,
//   ProjectRoleValidationErrors,
// } from '../../domain/project-role.entity';
// import { TechStack } from '@/contexts/techstack/domain/techstack.entity';
// import { Project } from '@/contexts/project/domain/project.entity';

// export class CreateProjectRoleCommand implements ICommand {
//   constructor(
//     public readonly props: {
//       projectId: string;
//       userId: string;
//       roleTitle: string;
//       description: string;
//       isFilled: boolean;
//       skillSet: TechStack[];
//     },
//   ) {}
// }

// @CommandHandler(CreateProjectRoleCommand)
// export class CreateProjectRoleCommandHandler
//   implements ICommandHandler<CreateProjectRoleCommand>
// {
//   constructor(
//     @Inject(PROJECT_ROLE_REPOSITORY_PORT)
//     private readonly projectRoleRepo: ProjectRoleRepositoryPort,
//     @Inject(PROJECT_REPOSITORY_PORT)
//     private readonly projectRepo: ProjectRepositoryPort,
//   ) {}

//   async execute(
//     command: CreateProjectRoleCommand,
//   ): Promise<Result<ProjectRole, string>> {
//     const { projectId, userId, roleTitle, description, isFilled, skillSet } =
//       command.props;

//     // Vérifier que le projet existe et récupérer le projet
//     const projectExistResult: Result<Project, string> =
//       await this.projectRepo.findById(projectId);
//     if (!projectExistResult.success) {
//       return Result.fail('Project not found');
//     }
//     const project: Project = projectExistResult.value;

//     // Vérifier que l'utilisateur peut modifier les rôles du projet
//     if (!project.canUserModifyRoles(userId)) {
//       return Result.fail('You are not allowed to add roles to this project');
//     }

//     // if (project.hasRoleWithTitle(roleTitle)) {
//     //   return Result.fail(
//     //     'A role with this title already exists in this project',
//     //   );
//     // }

//     // Créer l'entité ProjectRole
//     const projectRoleResult: Result<
//       ProjectRole,
//       ProjectRoleValidationErrors | string
//     > = ProjectRole.create({
//       projectId,
//       title: roleTitle,
//       description,
//       isFilled,
//       techStacks: skillSet,
//     });

//     if (!projectRoleResult.success) {
//       return Result.fail(
//         typeof projectRoleResult.error === 'string'
//           ? projectRoleResult.error
//           : JSON.stringify(projectRoleResult.error),
//       );
//     }

//     // Sauvegarder le rôle
//     const saveResult: Result<ProjectRole, string> =
//       await this.projectRoleRepo.create(projectRoleResult.value);
//     if (!saveResult.success) {
//       return Result.fail(saveResult.error);
//     }

//     return Result.ok(saveResult.value);
//   }
// }
