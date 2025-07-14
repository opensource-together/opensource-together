// import { Prisma } from '@prisma/client';
// import {
//   ApplicationStatus,
//   ProjectRoleApplication,
// } from '../../domain/project-role-application.entity';
// import { Result } from '@/libs/result';

// export class PrismaProjectRoleApplicationMapper {
//   static toRepo(
//     domainEntity: ProjectRoleApplication,
//   ): Result<Prisma.ProjectRoleApplicationCreateInput, string> {
//     const toRepo: Prisma.ProjectRoleApplicationCreateInput = {
//       userId: domainEntity.userId,
//       projectRoleId: domainEntity.projectRoleId,
//       status: domainEntity.status,
//       motivationLetter: domainEntity.motivationLetter,
//       selectedKeyFeatures: domainEntity.selectedKeyFeatures,
//       selectedProjectGoals: domainEntity.selectedProjectGoals,
//       rejectionReason: domainEntity.rejectionReason,
//     };
//     return Result.ok(toRepo);
//   }

//   static toDomain(
//     prismaEntity: Prisma.ProjectRoleApplication,
//   ): Result<ProjectRoleApplication, string> {
//     return ProjectRoleApplication.reconstitute(prismaEntity).map(
//       (domainEntity) => {
//         return {
//           id: prismaEntity.id,
//           userId: prismaEntity.userId,
//           projectRoleId: prismaEntity.projectRoleId,
//           status: prismaEntity.status as ApplicationStatus,
//           motivationLetter: prismaEntity.motivationLetter,
//           selectedKeyFeatures: prismaEntity.selectedKeyFeatures,
//           selectedProjectGoals: prismaEntity.selectedProjectGoals,
//           rejectionReason: prismaEntity.rejectionReason,
//           appliedAt: prismaEntity.appliedAt,
//           createdAt: prismaEntity.createdAt,
//           updatedAt: prismaEntity.updatedAt,
//         };
//       },
//     );
//   }
// }
