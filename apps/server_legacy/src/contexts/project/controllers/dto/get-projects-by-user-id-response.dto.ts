import { Project, ProjectData } from '@/contexts/project/domain/project.entity';

export class GetProjectsByUserIdResponseDto {
  public static toResponse(projects: Project[]): ProjectData[] {
    return projects.map((project) => project.toPrimitive());
  }
}
