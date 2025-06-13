import { Project } from '@/domain/project/project.entity';
import { ProjectResponseDto } from './project-response.dto';

export function toProjectResponseDto(project: Project): ProjectResponseDto {
  return {
    id: project.getId(),
    title: project.getTitle(),
    description: project.getDescription(),
    link: project.getLink(),
    ownerId: project.getOwnerId(),
    createdAt: project.getCreatedAt(),
    updatedAt: project.getUpdatedAt(),
    techStacks: project.getTechStacks().map((ts) => ({
      id: ts.getId(),
      name: ts.getName(),
    })),
    projectMembers: project.getTeamMembers().map((tm) => ({
      userId: tm.getUserId(),
      projectRoleId: tm.getProjectRole()?.getId(),
      roleTitle: tm.getProjectRole()?.getRoleTitle(),
    })),
    projectRoles: project.getProjectRoles().map((pr) => ({
      id: pr.getId(),
      roleTitle: pr.getRoleTitle(),
      description: pr.getDescription(),
      isFilled: pr.getIsFilled(),
      skillSet: pr.getSkillSet().map((ts) => ({
        id: ts.getId(),
        name: ts.getName(),
      })),
    })),
  };
}
