import { Controller, Get } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { GetAllTechStacksQuery } from '@/contexts/techstack/use-cases/queries/get-all-techstacks.query';
import { TechStack } from '@/contexts/techstack/domain/techstack.entity';
import { Result } from '@/libs/result';

@Controller('techstacks')
export class TechStackController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get()
  async getAllTechStacks(): Promise<TechStack[] | { error: string }> {
    const result: Result<TechStack[], string> = await this.queryBus.execute(
      new GetAllTechStacksQuery(),
    );

    if (!result.success) {
      return { error: result.error };
    }

    return result.value;
  }
}
