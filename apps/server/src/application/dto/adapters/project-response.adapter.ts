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
      iconUrl: ts.getIconUrl(),
    })),
  };
}
