import { TechStackDto } from '@/contexts/project/infrastructure/controllers/dto/TechStackDto.request';

export class UpdateProjectRoleInputsDto {
  roleTitle?: string;
  description?: string;
  isFilled?: boolean;
  skillSet?: TechStackDto[];
}
