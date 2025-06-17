import { GetTechstackListsQuery } from '@/application/teckstack/queries/get-teckstack-lists.query';
import { BadRequestException, Controller, Get } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { Result } from '@/shared/result';
import { TechStack } from '@/domain/techStack/techstack.entity';

@Controller('techstack')
export class TechstackController {
  constructor(private readonly queryBus: QueryBus) {}
  @Get()
  async getTechstack(): Promise<TechStack[]> {
    const result = await this.queryBus.execute<
      GetTechstackListsQuery,
      Result<TechStack[]>
    >(new GetTechstackListsQuery());

    if (!result.success) {
      throw new BadRequestException(result.error);
    }

    return result.value;
  }
}
