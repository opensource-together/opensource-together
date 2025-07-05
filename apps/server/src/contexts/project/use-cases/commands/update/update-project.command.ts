// import { ICommandHandler, CommandHandler, ICommand } from '@nestjs/cqrs';
// import { ProjectRepositoryPort } from '../../ports/project.repository.port';
// import { PROJECT_REPOSITORY_PORT } from '@/contexts/project/use-cases/ports/project.repository.port';
// import { Inject } from '@nestjs/common';
// import { Result } from '@/shared/result';
// import {
//   Project,
//   ProjectCreateProps,
//   ProjectValidationErrors,
// } from '@/contexts/project/domain/project.entity';

// export class UpdateProjectCommand implements ICommand {
//   constructor(
//     public readonly props: Partial<ProjectCreateProps> & { userId: string },
//   ) {}
// }

// @CommandHandler(UpdateProjectCommand)
// export class UpdateProjectCommandHandler
//   implements ICommandHandler<UpdateProjectCommand>
// {
//   constructor(
//     @Inject(PROJECT_REPOSITORY_PORT)
//     private readonly projectRepo: ProjectRepositoryPort,
//   ) {}

//   async execute(
//     command: UpdateProjectCommand,
//   ): Promise<Result<Project, string>> {
//     const { id, userId, ...rest } = command.props;
//     const projectToUpdate = await this.projectRepo.findById(id as string);
//     if (!projectToUpdate.success) {
//       return Result.fail('Project not found');
//     }

//     const projectToUpdatePrimitive = projectToUpdate.value.toPrimitive();
//     if (projectToUpdatePrimitive.ownerId !== userId) {
//       return Result.fail('User is not the owner of the project');
//     }

//     const projectToUpdateWithNewData = {
//       ...projectToUpdatePrimitive,
//       ...rest,
//       techStacks: projectToUpdatePrimitive.techStacks.map((techStack) =>
//         techStack.toPrimitive(),
//       ),
//     };

//     const updatedProject: Result<Project, ProjectValidationErrors | string> =
//       Project.reconstitute(projectToUpdateWithNewData);
//     if (!updatedProject.success)
//       return Result.fail(updatedProject.error as string);

//     const projectUpdated = await this.projectRepo.update(
//       id as string,
//       updatedProject.value,
//     );
//     if (!projectUpdated.success) {
//       return Result.fail(projectUpdated.error);
//     }
//     return Result.ok(projectUpdated.value);
//   }
// }
