import { TechStackDto } from '@/contexts/project/infrastructure/controllers/dto/TechStackDto.request';
export class CreateProjectDtoInput {
  title: string;
  description: string;
  link: string | null;
  ownerId: string;
  techStacks: TechStackDto[];
}
