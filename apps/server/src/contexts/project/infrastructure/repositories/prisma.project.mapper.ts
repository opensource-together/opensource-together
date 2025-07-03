// import { Project as DomainProject } from '@/contexts/project/domain/project.entity';
// import { ProjectFactory } from '@/contexts/project/domain/factory/project.factory';
// import { TechStackFactory } from '@/domain/techStack/techStack.factory';
// import { Result } from '@/shared/result';
// import {
//   Project as PrismaProject,
//   TechStack,
//   Prisma,
//   Difficulty,
//   ProjectRole,
//   teamMember,
// } from '@prisma/client';
// import { ProjectRoleFactory } from '@/domain/projectRole/projectRole.factory';
// import TeamMemberFactory from '@/domain/teamMember/teamMember.factory';

// type PrismaProjectWithIncludes = PrismaProject & {
//   techStacks: TechStack[];
//   projectMembers: teamMember[];
//   projectRoles: (ProjectRole & { skillSet: TechStack[] })[];
// };

// export class PrismaProjectMapper {
//   static toRepo(project: DomainProject): Result<Prisma.ProjectCreateInput> {
//     return Result.ok({
//       title: project.title,
//       description: project.description,
//       difficulty: PrismaProjectMapper.toPrismaDifficulty(project.difficulty),
//       link: project.link,
//       github: project.githubLink || '',
//       ownerId: project.ownerId,
//       techStacks: {
//         connect: project.techStacks.map((techStack) => ({
//           id: techStack.id,
//         })),
//       },
//       projectRoles: {
//         create: project.projectRoles.map((role) => ({
//           roleTitle: role.roleTitle,
//           skillSet: {
//             connect: role.skillSet.map((tech) => ({
//               id: tech.id,
//             })),
//           },
//           description: role.description,
//           isFilled: role.isFilled,
//         })),
//       },
//       projectMembers: {
//         create: project.teamMembers.map((member) => ({
//           userId: member.userId,
//         })),
//       },
//     });
//   }

//   static toDomain(
//     prismaProject: PrismaProjectWithIncludes,
//   ): Result<DomainProject> {
//     // Transformer les techStacks (relation existante)
//     const techStacksResult = TechStackFactory.fromPersistence(
//       prismaProject.techStacks,
//     );
//     if (!techStacksResult.success) return Result.fail(techStacksResult.error);

//     // Transformer les projectRoles
//     const projectRolesResult =
//       prismaProject.projectRoles.length > 0
//         ? ProjectRoleFactory.fromPersistence(prismaProject.projectRoles)
//         : Result.ok([]);
//     if (!projectRolesResult.success)
//       return Result.fail(projectRolesResult.error);

//     // Transformer les teamMembers (en supposant qu'il existe un TeamMemberFactory)
//     const teamMembersResult =
//       prismaProject.projectMembers.length > 0
//         ? TeamMemberFactory.fromPersistence(prismaProject.projectMembers)
//         : Result.ok([]);
//     if (!teamMembersResult.success) return Result.fail(teamMembersResult.error);

//     // Créer l'entité de domaine avec toutes les relations
//     return ProjectFactory.fromPersistence({
//       id: prismaProject.id,
//       title: prismaProject.title,
//       description: prismaProject.description,
//       link: prismaProject.link,
//       ownerId: prismaProject.ownerId,
//       techStacks: techStacksResult.value,
//       difficulty: PrismaProjectMapper.fromPrismaDifficulty(
//         prismaProject.difficulty,
//       ),
//       githubLink: prismaProject.github,
//       createdAt: prismaProject.createAt,
//       updatedAt: prismaProject.updatedAt,
//       projectRoles: projectRolesResult.value,
//       teamMembers: teamMembersResult.value,
//     });
//   }

//   public static toPrismaDifficulty(
//     difficulty: 'easy' | 'medium' | 'hard',
//   ): Difficulty {
//     switch (difficulty) {
//       case 'easy':
//         return Difficulty.EASY;
//       case 'medium':
//         return Difficulty.MEDIUM;
//       case 'hard':
//         return Difficulty.HARD;
//     }
//   }

//   public static fromPrismaDifficulty(
//     difficulty: Difficulty,
//   ): 'easy' | 'medium' | 'hard' {
//     switch (difficulty) {
//       case Difficulty.EASY:
//         return 'easy';
//       case Difficulty.MEDIUM:
//         return 'medium';
//       case Difficulty.HARD:
//         return 'hard';
//     }
//   }
// }
