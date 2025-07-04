import { Project, ProjectData } from '@/contexts/project/domain/project.entity';

export class CreateProjectResponseDto {
  public static toResponse(project: Project): ProjectData {
    const projectData = project.toPrimitive();
    return projectData;
  }
}
