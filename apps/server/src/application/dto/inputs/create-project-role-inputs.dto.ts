import { TechStackDto } from '@/contexts/project/infrastructure/controllers/dto/TechStackDto.request';

export class CreateProjectRoleInputsDto {
  projectId: string;
  roleTitle: string;
  description: string;
  isFilled: boolean;
  skillSet: TechStackDto[];
}
