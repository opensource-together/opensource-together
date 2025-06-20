import { TechStackDto } from '@/presentation/project/dto/TechStackDto.request';

export class ProjectRoleResponseDto {
  id: string;
  projectId: string;
  roleTitle: string;
  description: string;
  isFilled: boolean;
  skillSet: TechStackDto[];
}
