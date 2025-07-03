// import { Project } from '@/contexts/project/domain/project.entity.legacy';
// import { ProjectResponseDto } from './project-response.dto';
// import { TechStack } from '@/domain/techStack/techstack.entity';

// export function toProjectResponseDto(project: Project): ProjectResponseDto {
//   return {
//     id: project.getId(),
//     title: project.getTitle(),
//     description: project.getDescription(),
//     link: project.getLink(),
//     ownerId: project.getOwnerId(),
//     createdAt: project.getCreatedAt(),
//     updatedAt: project.getUpdatedAt(),
//     techStacks: project.getTechStacks().map((ts: TechStack) => ({
//       id: ts.id,
//       name: ts.name,
//       iconUrl: ts.iconUrl,
//     })),
//     projectMembers: project.teamMembers.map((tm) => ({
//       userId: tm.userId,
//       projectRoleId: tm.projectRoleId,
//       roleTitle: tm.roleTitle,
//     })),
//     projectRoles: project.projectRoles.map((pr) => ({
//       id: pr.id,
//       roleTitle: pr.roleTitle,
//       description: pr.description,
//       isFilled: pr.isFilled,
//       skillSet: pr.skillSet.map((ts) => ({
//         id: ts.id,
//         name: ts.name,
//         iconUrl: ts.iconUrl,
//       })),
//     })),
//   };
// }
