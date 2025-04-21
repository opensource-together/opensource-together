import { TechStackDto } from '@/presentation/project/dto/TechStackDto.request';

export class CreateProjectDtoInput {
  id: string;
  title: string;
  description: string;
  link: string;
  status: 'PUBLISHED' | 'DRAFT';
  userId: string;
  techStacks: TechStackDto[];
}
