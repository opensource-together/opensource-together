import { TechStackDto } from '@/presentation/project/dto/TechStackDto.request';
export class CreateProjectDtoInput {
  title: string;
  description: string;
  link: string | null;
  ownerId: string;
  techStacks: TechStackDto[];
}
