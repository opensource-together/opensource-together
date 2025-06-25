import { TechStackDto } from '@/presentation/project/dto/TechStackDto.request';

export class CreateProjectRoleInputsDto {
  projectId: string;
  roleTitle: string;
  description: string;
  isFilled: boolean;
  skillSet: TechStackDto[];
}
