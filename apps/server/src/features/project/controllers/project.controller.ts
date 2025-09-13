import { GitHubOctokit } from '@/features/github/controllers/github-octokit.decorator';
import { GithubAuthGuard } from '@/features/github/controllers/guards/github-auth.guard';
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Octokit } from '@octokit/rest';
import {
  AuthGuard,
  Public,
  Session,
  UserSession,
} from '@thallesp/nestjs-better-auth';
import { ProjectService } from '../services/project.service';
import { CreateProjectDocs } from './docs/create-project.swagger.decorator';
import { DeleteProjectByIdDocs } from './docs/delete-project-by-id.swagger.decorator';
import { FindAllProjectsDocs } from './docs/find-all-projects.swagger.decorator';
import { FindMyProjectByIdDocs } from './docs/find-my-project-by-id.swagger.decorator';
import { FindMyProjectsDocs } from './docs/find-my-projects.swagger.decorator';
import { FindProjectByIdDocs } from './docs/find-project-by-id.swagger.decorator';
import { UpdateProjectByIdDocs } from './docs/update-project-by-id.swagger.decorator';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ProjectStatsResponseDto } from '../dto/project-stats.response.dto';
import { Project } from '../domain/project';

@Controller('projects')
@UseGuards(AuthGuard)
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @UseGuards(GithubAuthGuard)
  @Get()
  @Public()
  @FindAllProjectsDocs()
  async findAll(@GitHubOctokit() octokit: Octokit) {
    const result = await this.projectService.findAll(octokit);
    if (!result.success) {
      throw new BadRequestException(result.error);
    }
    return result.value;
  }

  @UseGuards(GithubAuthGuard)
  @Get('me')
  @FindMyProjectsDocs()
  async findMyProjects(
    @Session() session: UserSession,
    @GitHubOctokit() octokit: Octokit,
  ) {
    const userId = session.user.id;
    const result = await this.projectService.findByUserId(userId, octokit);
    if (!result.success) {
      throw new BadRequestException(result.error);
    }
    return result.value;
  }

  @UseGuards(GithubAuthGuard)
  @Get('me/:id')
  @FindMyProjectByIdDocs()
  async findMyProjectById(
    @Param('id') projectId: string,
    @Session() session: UserSession,
    @GitHubOctokit() octokit: Octokit,
  ) {
    const userId = session.user.id;
    const result = await this.projectService.findMyProjectById(
      userId,
      projectId,
      octokit,
    );
    if (!result.success) {
      if (result.error === 'PROJECT_NOT_FOUND') {
        throw new HttpException('Project not found', HttpStatus.NOT_FOUND);
      }
      if (result.error === 'UNAUTHORIZED') {
        throw new HttpException(
          'Project does not belong to user',
          HttpStatus.FORBIDDEN,
        );
      }
      throw new BadRequestException(result.error);
    }
    return result.value;
  }

  @UseGuards(GithubAuthGuard)
  @Post()
  @CreateProjectDocs()
  async createProject(
    @Session() session: UserSession,
    @Body() createProjectDto: CreateProjectDto,
    @Query('method') method: 'scratch' | 'github',
    @GitHubOctokit() octokit: Octokit,
  ) {
    const userId = session.user.id;
    const result = await this.projectService.createProject({
      createProjectDto,
      userId,
      method,
      octokit,
    });
    if (!result.success) {
      throw new BadRequestException(result.error);
    }
    return result.value;
  }

  @UseGuards(GithubAuthGuard)
  @Public()
  @Get(':id')
  @FindProjectByIdDocs()
  async findById(
    @Param('id') id: string,
    @GitHubOctokit() octokit: Octokit,
  ): Promise<Project & { projectStats: ProjectStatsResponseDto }> {
    const result = await this.projectService.findById(id, octokit);
    if (!result.success) {
      throw new HttpException(result.error, HttpStatus.NOT_FOUND);
    }
    return result.value;
  }

  @UseGuards(GithubAuthGuard)
  @Patch(':id')
  @UpdateProjectByIdDocs()
  async update(
    @Param('id') projectId: string,
    @Body() updateProjectDto: UpdateProjectDto,
    @Session() session: UserSession,
    @GitHubOctokit() octokit: Octokit,
  ) {
    const userId = session.user.id;
    const result = await this.projectService.update(
      userId,
      projectId,
      updateProjectDto,
      octokit,
    );
    if (!result.success) {
      throw new BadRequestException(result.error);
    }
    return result.value;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @DeleteProjectByIdDocs()
  async delete(@Param('id') id: string, @Session() session: UserSession) {
    const userId = session.user.id;
    const result = await this.projectService.delete(id, userId);
    if (!result.success) {
      throw new BadRequestException(result.error);
    }
    return;
  }
}
