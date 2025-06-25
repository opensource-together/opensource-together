import { toGithubRepositoryDto } from '@/application/dto/adapters/github/github-repository.adapter';
import { GithubRepositoryDto } from '@/application/dto/adapters/github/github-repository.dto';
import { CreateGithubRepositoryInput } from '@/application/dto/inputs/create-github-repository-inputs.dto';
import { GithubAuthGuard } from '@/presentation/guards/github-auth.guard';
import { GithubAuthRequest } from '@/presentation/types/github-auth-request.interface';
import {
  Body,
  Controller,
  InternalServerErrorException,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

@Controller('github/repository')
@UseGuards(GithubAuthGuard)
export class GithubRepositoryController {
  constructor() {}

  @Post('create')
  async getUser(
    @Req() req: GithubAuthRequest,
    @Body() body: CreateGithubRepositoryInput,
  ): Promise<GithubRepositoryDto> {
    const response = await req.octokit.rest.repos.createForAuthenticatedUser({
      name: body.name,
      description: body.description,
      private: false,
    });

    const repository = toGithubRepositoryDto(response);
    if (!repository.success) {
      throw new InternalServerErrorException();
    }

    return repository.value;
  }
}
