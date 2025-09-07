import {
  Controller,
  Body,
  Post,
  Get,
  UseGuards,
  BadRequestException,
  Patch,
  Param,
  HttpStatus,
  HttpException,
  Delete,
} from '@nestjs/common';
import { ProjectService } from '../services/project.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import {
  AuthGuard,
  Public,
  Session,
  UserSession,
} from '@thallesp/nestjs-better-auth';
import { GithubAuthGuard } from '@/features/github/controllers/guards/github-auth.guard';
import { Octokit } from '@octokit/rest';
import { GitHubOctokit } from '@/features/github/controllers/github-octokit.decorator';
import { FindAllProjectsDocs } from './docs/find-all-projects.swagger.decorator';
import { CreateProjectDocs } from './docs/create-project.swagger.decorator';
import { FindProjectByIdDocs } from './docs/find-project-by-id.swagger.decorator';
import { UpdateProjectByIdDocs } from './docs/update-project-by-id.swagger.decorator';
import { DeleteProjectByIdDocs } from './docs/delete-project-by-id.swagger.decorator';

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
  @Post()
  @CreateProjectDocs()
  async createProject(
    @Session() session: UserSession,
    @Body() createProjectDto: CreateProjectDto,
    @GitHubOctokit() octokit: Octokit,
  ) {
    const userId = session.user.id;
    const result = await this.projectService.createProject({
      createProjectDto,
      userId,
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
  async findById(@Param('id') id: string, @GitHubOctokit() octokit: Octokit) {
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
  @DeleteProjectByIdDocs()
  async delete(@Param('id') id: string, @Session() session: UserSession) {
    const userId = session.user.id;
    const result = await this.projectService.delete(id, userId);
    if (!result.success) {
      throw new BadRequestException(result.error);
    }
    return { message: 'Project deleted successfully' };
  }
}
