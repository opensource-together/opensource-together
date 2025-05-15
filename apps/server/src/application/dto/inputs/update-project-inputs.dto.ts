import { TechStackDto } from '@/presentation/project/dto/TechStackDto.request';
export class UpdateProjectInputsDto {
  title?: string;
  description?: string;
  link?: string;
  status?: string;
  techStacks?: TechStackDto[];
}
