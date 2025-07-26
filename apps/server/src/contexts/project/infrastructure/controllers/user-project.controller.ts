import { Logger } from '@nestjs/common';
import { GitHubOctokit } from '@/contexts/github/infrastructure/decorators/github-octokit.decorator';
import { GithubAuthGuard } from '@/contexts/github/infrastructure/guards/github-auth.guard';
import {
  Author,
  Contributor,
  LastCommit,
  RepositoryInfo,
} from '@/contexts/github/use-cases/ports/github-repository.port';
import { Project } from '@/contexts/project/domain/project.entity';
import { CreateProjectCommand } from '@/contexts/project/use-cases/commands/create/create-project.command';
import { UpdateProjectCommand } from '@/contexts/project/use-cases/commands/update/update-project.command';
import { DeleteProjectCommand } from '@/contexts/project/use-cases/commands/delete/delete-project.command';
import { FindProjectsByUserIdQuery } from '@/contexts/project/use-cases/queries/find-by-user-id/find-projects-by-user-id.handler';
import { Result } from '@/libs/result';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  ApiBody,
  ApiCookieAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Octokit } from '@octokit/rest';
import { Session } from 'supertokens-nestjs';
import { CreateProjectDtoRequest } from './dto/create-project-request.dto';
import { CreateProjectResponseDto } from './dto/create-project-response.dto';
import { GetProjectsResponseDto } from './dto/get-projects-response.dto';
import { UpdateProjectDtoRequest } from './dto/update-project-request.dto';
import { UpdateProjectResponseDto } from './dto/update-project-response.dto';

@ApiTags('User Projects')
@Controller('projects/me')
@ApiCookieAuth('sAccessToken')
export class UserProjectController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @ApiOperation({ summary: 'Récupérer tous les projets de l\'utilisateur connecté' })
  @ApiResponse({
    status: 200,
    description: 'Liste des projets de l\'utilisateur',
  })
  @ApiResponse({ status: 401, description: 'Non authentifié' })
  @UseGuards(GithubAuthGuard)
  @Get()
  async getUserProjects(
    @Session('userId') userId: string,
    @GitHubOctokit() octokit?: Octokit,
  ) {
    const projects: Result<Project[]> = await this.queryBus.execute(
      new FindProjectsByUserIdQuery(userId)
    );
    
    if (!projects.success) {
      throw new HttpException(projects.error, HttpStatus.BAD_REQUEST);
    }
    
    // TODO: Add GitHub stats enrichment similar to getProjects
    return GetProjectsResponseDto.toResponse(projects.value);
  }

  @Post()
  @UseGuards(GithubAuthGuard)
  @ApiOperation({ summary: 'Créer un nouveau projet pour l\'utilisateur connecté' })
  @ApiBody({
    description: 'Données du projet',
    type: CreateProjectDtoRequest,
  })
  @ApiResponse({
    status: 201,
    description: 'Projet créé',
  })
  @ApiResponse({
    status: 400,
    description: 'Erreur de validation',
  })
  async createUserProject(
    @Session('userId') ownerId: string,
    @Query('method') method: string,
    @GitHubOctokit() octokit: Octokit,
    @Body() project: CreateProjectDtoRequest,
  ) {
    Logger.log({ image: project.image });
    const projectRes: Result<Project> = await this.commandBus.execute(
      new CreateProjectCommand({
        ownerId: ownerId,
        title: project.title,
        description: project.description,
        shortDescription: project.shortDescription,
        externalLinks: project.externalLinks || [],
        techStacks: project.techStacks,
        projectRoles: project.projectRoles.map((role) => ({
          title: role.title,
          description: role.description,
          techStacks: role.techStacks,
        })),
        categories: project.categories,
        keyFeatures: project.keyFeatures.map((feature) => ({
          feature: feature,
        })),
        projectGoals: project.projectGoals.map((goal) => ({
          goal: goal,
        })),
        octokit: octokit,
        method: method,
        image: project.image,
      }),
    );
    
    if (!projectRes.success) {
      throw new HttpException(projectRes.error, HttpStatus.BAD_REQUEST);
    }
    
    return CreateProjectResponseDto.toResponse(projectRes.value);
  }

  @Patch(':id')
  @UseGuards(GithubAuthGuard)
  @ApiOperation({ summary: 'Mettre à jour un projet de l\'utilisateur connecté' })
  @ApiParam({ name: 'id', description: 'ID du projet' })
  @ApiBody({
    description: 'Données de mise à jour',
    type: UpdateProjectDtoRequest,
  })
  @ApiResponse({
    status: 200,
    description: 'Projet mis à jour',
  })
  @ApiResponse({
    status: 403,
    description: 'Accès interdit',
  })
  @ApiResponse({
    status: 404,
    description: 'Projet non trouvé',
  })
  async updateUserProject(
    @Session('userId') ownerId: string,
    @Param('id') id: string,
    @Body() project: UpdateProjectDtoRequest,
  ) {
    const projectRes: Result<Project, string> = await this.commandBus.execute(
      new UpdateProjectCommand(id, ownerId, {
        title: project.title,
        description: project.description,
        shortDescription: project.shortDescription,
        externalLinks: project.externalLinks,
        techStacks: project.techStacks,
        categories: project.categories,
        keyFeatures: project.keyFeatures,
        projectGoals: project.projectGoals,
        image: project.image,
      }),
    );

    if (!projectRes.success) {
      if (projectRes.error === 'Project not found') {
        throw new HttpException(projectRes.error, HttpStatus.NOT_FOUND);
      }
      if (projectRes.error === 'You are not allowed to update this project') {
        throw new HttpException(projectRes.error, HttpStatus.FORBIDDEN);
      }
      throw new HttpException(projectRes.error, HttpStatus.BAD_REQUEST);
    }

    return UpdateProjectResponseDto.toResponse(projectRes.value);
  }

  @Delete(':id')
  @UseGuards(GithubAuthGuard)
  @ApiOperation({ summary: 'Supprimer un projet de l\'utilisateur connecté' })
  @ApiParam({ name: 'id', description: 'ID du projet' })
  @ApiResponse({
    status: 200,
    description: 'Projet supprimé',
  })
  @ApiResponse({
    status: 403,
    description: 'Accès interdit',
  })
  @ApiResponse({
    status: 404,
    description: 'Projet non trouvé',
  })
  async deleteUserProject(
    @Session('userId') ownerId: string,
    @Param('id') id: string,
  ) {
    const result: Result<Project> = await this.commandBus.execute(
      new DeleteProjectCommand(id, ownerId),
    );

    if (!result.success) {
      if (result.error === 'Project not found') {
        throw new HttpException(result.error, HttpStatus.NOT_FOUND);
      }
      if (result.error === 'You are not allowed to delete this project') {
        throw new HttpException(result.error, HttpStatus.FORBIDDEN);
      }
      throw new HttpException(result.error, HttpStatus.BAD_REQUEST);
    }

    return { message: 'Project deleted successfully' };
  }
}