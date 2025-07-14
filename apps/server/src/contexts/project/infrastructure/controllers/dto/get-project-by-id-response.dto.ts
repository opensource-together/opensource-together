import { Project, ProjectData } from '@/contexts/project/domain/project.entity';

export class GetProjectByIdResponseDto {
  public static toResponse(project: Project): ProjectData {
    return project.toPrimitive();
  }
}
