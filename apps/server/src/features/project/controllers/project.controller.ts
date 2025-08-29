import {
  Controller,
  Body,
  Post,
  Get,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { ProjectService } from '../services/project.service';
import { CreateProjectDto } from './dto/create-project.dto';
import {
  AuthGuard,
  Public,
  Session,
  UserSession,
} from '@thallesp/nestjs-better-auth';
import { GithubAuthGuard } from '@/features/github/controllers/guards/github-auth.guard';
import { Octokit } from '@octokit/rest';
import { GitHubOctokit } from '@/features/github/controllers/github-octokit.decorator';

@Controller('projects')
@UseGuards(AuthGuard)
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Get()
  @Public()
  getProjects() {
    return [];
  }

  @UseGuards(GithubAuthGuard)
  @Post()
  async createProject(
    @Session() session: UserSession,
    @Body() createProjectDto: CreateProjectDto,
    @GitHubOctokit() octokit: Octokit,
  ) {
    console.log('session', session);
    console.log('session.user.id', session.user.id);
    // console.log('octokit', octokit);
    const userId = session.user.id;
    const { title, description, categories, techStacks } = createProjectDto;
    const result = await this.projectService.createProject(
      {
        ownerId: userId,
        title,
        description,
        categories,
        techStacks,
        projectRoles: createProjectDto.projectRoles || [],
      },
      octokit,
    );
    if (!result.success) {
      throw new BadRequestException(result.error);
    }
    return result.value;
  }
}
