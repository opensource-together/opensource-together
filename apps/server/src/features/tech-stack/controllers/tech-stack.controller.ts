import { Controller, Get, HttpException, HttpStatus } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { TechStackResponse } from '../domain/tech-stack';
import { TechStackService } from '../services/tech-stack.service';
import { GetAllTechstacksDocs } from './docs/get-all-tech-stacks.swagger.decorator';

@ApiTags('Tech Stacks')
@Controller('techstacks')
export class TechStackController {
  constructor(private readonly techStackService: TechStackService) {}

  @Get()
  @GetAllTechstacksDocs()
  async getAllTechStacks(): Promise<TechStackResponse> {
    const result = await this.techStackService.getAllTechStacks();
    if (!result.success) {
      throw new HttpException(
        'Failed to fetch tech stacks',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return result.value;
  }
}
