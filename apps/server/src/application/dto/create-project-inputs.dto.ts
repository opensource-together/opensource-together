import { TechStackDto } from '@/presentation/project/dto/TechStackDto.request';
import { ProjectStatus } from '@prisma/client';
export class CreateProjectDtoInput {
  title: string;
  description: string;
  link: string;
  status: ProjectStatus | null;
  userId: string;
  techStacks: TechStackDto[];
}
