import { TechStackDto } from '@/presentation/project/dto/TechStackDto.request';
export class CreateProjectDtoInput {
  title: string;
  description: string;
  link: string;
  status: string;
  userId: string;
  techStacks: TechStackDto[];
}
