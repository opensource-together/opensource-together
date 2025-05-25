import { TechStackDto } from '@/presentation/project/dto/TechStackDto.request';

export class CreateProjectRoleCommand {
  constructor(
    public readonly projectId: string,
    public readonly roleTitle: string,
    public readonly skillSet: TechStackDto[],
    public readonly description: string,
    public readonly isFilled: boolean,
  ) {}
}
