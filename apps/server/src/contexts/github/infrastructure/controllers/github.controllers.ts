import {
  Body,
  Controller,
  Post,
  Req,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import {
  GithubAuthGuard,
  GithubAuthRequest,
} from '../guards/github-auth.guard';
import { CreateGitHubRepositoryCommand } from '../../use-cases/commands/create-github-repository.command';
import { Result } from '@/shared/result';
import { GithubRepositoryDto } from '@/contexts/github/infrastructure/repositories/dto/github-repository.dto';
import { Session } from 'supertokens-nestjs';

@Controller('github/repository')
@UseGuards(GithubAuthGuard)
export class GithubRepositoryController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post('create')
  async createRepository(
    @Session('userId') userId: string,
    @Req() req: GithubAuthRequest,
    @Body()
    body: {
      name: string;
      description?: string;
      isPrivate?: boolean;
    },
  ): Promise<any> {
    console.log({ userId });

    if (!userId) {
      throw new UnauthorizedException('User not authenticated');
    }

    // Utiliser directement Octokit pour créer le repo sur GitHub
    // const githubResponse =
    //   await req.octokit.rest.repos.createForAuthenticatedUser({
    //     name: body.name,
    //     description: body.description,
    //     private: body.isPrivate ?? false,
    //     headers: {
    //       'X-GitHub-Api-Version': '2022-11-28',
    //     },
    //   });

    // Ensuite utiliser le Command pour sauvegarder en BDD
    const command = new CreateGitHubRepositoryCommand(
      userId,
      req.octokit,
      body.name,
      body.description,
      body.isPrivate ?? false,
    );

    const result: Result<GithubRepositoryDto, string> =
      await this.commandBus.execute(command);

    if (!result.success) {
      throw new Error(result.error);
    }

    return {
      github: result.value,
      local: result.value,
    };
  }
}
