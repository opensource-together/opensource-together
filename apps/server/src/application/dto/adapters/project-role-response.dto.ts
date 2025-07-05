import { TechStackDto } from '@/contexts/project/infrastructure/controllers/dto/TechStackDto.request';

export class ProjectRoleResponseDto {
  id: string;
  projectId: string;
  roleTitle: string;
  description: string;
  isFilled: boolean;
  skillSet: TechStackDto[];
}
