import { TechStackDto } from '@/presentation/project/dto/TechStackDto.request';

export class UpdateProjectRoleInputsDto {
  roleTitle?: string;
  description?: string;
  isFilled?: boolean;
  skillSet?: TechStackDto[];
}
