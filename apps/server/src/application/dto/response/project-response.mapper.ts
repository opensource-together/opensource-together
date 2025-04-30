import { Project } from '@/domain/project/project.entity';
import { ProjectResponseDto } from './project-response.dto';

export function toProjectResponseDto(project: Project): ProjectResponseDto {
  return {
    id: project.getId(),
    title: project.getTitle(),
    description: project.getDescription(),
    status: project.getStatus(),
    link: project.getLink(),
    userId: project.getUserId(),
    techStacks: project.getTechStacks().map((ts) => ({
      id: ts.getId(),
      name: ts.getName(),
      iconUrl: ts.getIconUrl(),
    })),
  };
}
