import { Project } from '@/contexts/project/domain/project.entity';
import { Result } from '@/libs/result';
import {
  Body,
  Controller,
  Get,
  Param,
  // Query,
  HttpException,
  HttpStatus,
  Post,
  Patch,
  Delete,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiBody,
  ApiResponse,
  ApiCookieAuth,
} from '@nestjs/swagger';
import { CreateProjectCommand } from '@/contexts/project/use-cases/commands/create/create-project.command';
import { DeleteProjectCommand } from '@/contexts/project/use-cases/commands/delete/delete-project.command';
import { UpdateProjectCommand } from '@/contexts/project/use-cases/commands/update/update-project.command';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Session, PublicAccess } from 'supertokens-nestjs';
import { GetProjectsQuery } from '@/contexts/project/use-cases/queries/get-all/get-projects.handler';
import { FindProjectByIdQuery } from '@/contexts/project/use-cases/queries/find-by-id/find-project-by-id.handler';
import { GitHubOctokit } from '@/contexts/github/infrastructure/decorators/github-octokit.decorator';
import { GithubAuthGuard } from '@/contexts/github/infrastructure/guards/github-auth.guard';
import { Octokit } from '@octokit/rest';
import { CreateProjectDtoRequest } from './dto/create-project-request.dto';
import { CreateProjectResponseDto } from './dto/create-project-response.dto';
import { GetProjectsResponseDto } from './dto/get-projects-response.dto';
import { GetProjectByIdResponseDto } from './dto/get-project-by-id-response.dto';
import { UpdateProjectDtoRequest } from './dto/update-project-request.dto';
import { UpdateProjectResponseDto } from './dto/update-project-response.dto';
import { ProjectRoleApplication } from '@/contexts/project-role-application/domain/project-role-application.entity';
import { GetAllProjectApplicationsQuery } from '@/contexts/project-role-application/use-cases/queries/get-all-project-application.query';

@ApiTags('Projects')
@Controller('projects')
export class ProjectController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @PublicAccess()
  @Get()
  @ApiOperation({ summary: 'Récupérer tous les projets' })
  @ApiResponse({
    status: 200,
    description: 'Liste des projets',
    example: [
      {
        id: '123e4567-e89b-12d3-a456-426614174000',
        title: 'E-commerce Platform',
        description: 'Modern e-commerce app with React',
        shortDescription: 'E-commerce with React & Node.js',
        ownerId: 'github_user123',
        techStacks: [
          { id: '1', name: 'React', iconUrl: 'https://reactjs.org/logo.svg' },
          { id: '2', name: 'Node.js', iconUrl: 'https://nodejs.org/logo.svg' },
        ],
        categories: [{ id: '2', name: 'Développement Web' }],
        keyFeatures: [
          {
            id: 'feature1',
            projectId: '123e4567-e89b-12d3-a456-426614174000',
            feature: 'Shopping Cart',
          },
        ],
        projectGoals: [
          {
            id: 'goal1',
            projectId: '123e4567-e89b-12d3-a456-426614174000',
            goal: 'Create smooth UX',
          },
        ],
        projectRoles: [
          {
            id: 'role1',
            projectId: '123e4567-e89b-12d3-a456-426614174000',
            title: 'Frontend Developer',
            description: 'React developer needed',
            isFilled: false,
            techStacks: [
              {
                id: '1',
                name: 'React',
                iconUrl: 'https://reactjs.org/logo.svg',
              },
            ],
            createdAt: '2025-01-15T10:30:00.000Z',
            updatedAt: '2025-01-15T10:30:00.000Z',
          },
        ],
        externalLinks: [
          { type: 'github', url: 'https://github.com/user/project' },
        ],
        createdAt: '2025-01-15T10:30:00.000Z',
        updatedAt: '2025-01-20T14:45:00.000Z',
      },
    ],
  })
  @ApiResponse({ status: 500, description: 'Erreur serveur' })
  async getProjects() {
    const projects: Result<Project[]> = await this.queryBus.execute(
      new GetProjectsQuery(),
    );
    if (!projects.success) {
      throw new HttpException(projects.error, HttpStatus.BAD_REQUEST);
    }
    return GetProjectsResponseDto.toResponse(projects.value);
  }

  @PublicAccess()
  @Get(':id')
  @ApiOperation({ summary: 'Récupérer un projet par ID' })
  @ApiParam({ name: 'id', description: 'ID du projet' })
  @ApiResponse({
    status: 200,
    description: 'Détails du projet',
    example: {
      id: '123e4567-e89b-12d3-a456-426614174000',
      title: 'E-commerce Platform',
      description: 'Modern e-commerce app with React and Node.js',
      shortDescription: 'E-commerce with React & Node.js',
      ownerId: 'github_user123',
      techStacks: [
        { id: '1', name: 'React', iconUrl: 'https://reactjs.org/logo.svg' },
        { id: '2', name: 'Node.js', iconUrl: 'https://nodejs.org/logo.svg' },
      ],
      categories: [{ id: '2', name: 'Développement Web' }],
      keyFeatures: [
        {
          id: 'feature1',
          projectId: '123e4567-e89b-12d3-a456-426614174000',
          feature: 'Shopping Cart',
        },
      ],
      projectGoals: [
        {
          id: 'goal1',
          projectId: '123e4567-e89b-12d3-a456-426614174000',
          goal: 'Create smooth UX',
        },
      ],
      projectRoles: [
        {
          id: 'role1',
          projectId: '123e4567-e89b-12d3-a456-426614174000',
          title: 'Frontend Developer',
          description: 'React developer needed',
          isFilled: false,
          techStacks: [
            { id: '1', name: 'React', iconUrl: 'https://reactjs.org/logo.svg' },
          ],
          createdAt: '2025-01-15T10:30:00.000Z',
          updatedAt: '2025-01-15T10:30:00.000Z',
        },
      ],
      externalLinks: [
        { type: 'github', url: 'https://github.com/user/project' },
      ],
      createdAt: '2025-01-15T10:30:00.000Z',
      updatedAt: '2025-01-20T14:45:00.000Z',
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Projet non trouvé',
    example: { message: 'Project not found', statusCode: 404 },
  })
  async getProject(@Param('id') id: string) {
    const projectRes: Result<Project, string> = await this.queryBus.execute(
      new FindProjectByIdQuery(id),
    );
    if (!projectRes.success) {
      throw new HttpException(projectRes.error, HttpStatus.NOT_FOUND);
    }
    return GetProjectByIdResponseDto.toResponse(projectRes.value);
  }

  //   @Get('search')
  //   async getProjectsFiltered(
  //     @Query() filters: FilterProjectsDto,
  //   ): Promise<ProjectResponseDto[]> {
  //     // Construction de l'objet de filtres pour la Query interne
  //     const filterInputs = {
  //       title: filters.title,
  //       difficulty: filters.difficulty?.toLowerCase() as
  //         | 'easy'
  //         | 'medium'
  //         | 'hard',
  //       sortOrder: filters.sortOrder || 'desc',
  //       roles: filters.roles || [],
  //       techStacks: filters.techStacks || [],
  //     };

  //     const projectsFiltered: Result<Project[] | null> =
  //       await this.queryBus.execute(new FindProjectByFiltersQuery(filterInputs)); // TODO: Implement this query

  //     if (!projectsFiltered.success) {
  //       throw new HttpException(projectsFiltered.error, HttpStatus.BAD_REQUEST);
  //     }

  //     // Gestion du cas où aucun projet n'est trouvé
  //     if (!projectsFiltered.value) {
  //       return [];
  //     }

  //     return projectsFiltered.value.map((project: Project) =>
  //       toProjectResponseDto(project),
  //     );
  //   }

  @Post()
  @UseGuards(GithubAuthGuard)
  @ApiOperation({ summary: 'Créer un nouveau projet' })
  @ApiCookieAuth('sAccessToken')
  @ApiBody({
    description: 'Données du projet',
    schema: {
      type: 'object',
      required: [
        'title',
        'description',
        'shortDescription',
        'techStacks',
        'categories',
        'keyFeatures',
        'projectGoals',
        'projectRoles',
      ],
      properties: {
        title: { type: 'string', example: 'Mon Projet' },
        description: { type: 'string', example: 'Description du projet' },
        shortDescription: { type: 'string', example: 'Description courte' },
        techStacks: {
          type: 'array',
          items: { type: 'string' },
          example: ['1', '2'],
        },
        categories: {
          type: 'array',
          items: { type: 'string' },
          example: ['1'],
        },
        keyFeatures: {
          type: 'array',
          items: { type: 'string' },
          example: ['Feature 1'],
        },
        projectGoals: {
          type: 'array',
          items: { type: 'string' },
          example: ['Goal 1'],
        },
        projectRoles: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              title: { type: 'string', example: 'Developer' },
              description: { type: 'string', example: 'Role description' },
              techStacks: {
                type: 'array',
                items: { type: 'string' },
                example: ['1'],
              },
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Projet créé',
    example: {
      id: '5f4cbe9b-1305-43a2-95ca-23d7be707717',
      ownerId: 'bedb6486-1cbb-4333-b541-59d4af7da7f5',
      title: 'Mon Projet',
      shortDescription: 'Description courte',
      description: 'Description du projet',
      externalLinks: [
        { type: 'github', url: 'https://github.com/user/mon-projet' },
      ],
      techStacks: [
        { id: '1', name: 'React', iconUrl: 'https://reactjs.org/logo.svg' },
        { id: '2', name: 'Node.js', iconUrl: 'https://nodejs.org/logo.svg' },
      ],
      categories: [{ id: '1', name: 'Développement Web' }],
      keyFeatures: [
        {
          id: 'feature-id',
          projectId: '5f4cbe9b-1305-43a2-95ca-23d7be707717',
          feature: 'Feature 1',
        },
      ],
      projectGoals: [
        {
          id: 'goal-id',
          projectId: '5f4cbe9b-1305-43a2-95ca-23d7be707717',
          goal: 'Goal 1',
        },
      ],
      projectRoles: [
        {
          id: 'role-id',
          projectId: '5f4cbe9b-1305-43a2-95ca-23d7be707717',
          title: 'Developer',
          description: 'Role description',
          isFilled: false,
          techStacks: [
            { id: '1', name: 'React', iconUrl: 'https://reactjs.org/logo.svg' },
          ],
          createdAt: '2025-07-05T14:59:31.560Z',
          updatedAt: '2025-07-05T14:59:31.560Z',
        },
      ],
      createdAt: '2025-07-05T14:59:31.560Z',
      updatedAt: '2025-07-05T14:59:31.560Z',
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Erreur de validation',
    example: { error: 'Title must be at least 3 characters' },
  })
  @ApiResponse({
    status: 401,
    description: 'Non authentifié',
    example: { message: 'unauthorised', statusCode: 401 },
  })
  async createProject(
    @Session('userId') ownerId: string,
    @Req() req: Request,
    @GitHubOctokit() octokit: Octokit,
    @Body() project: CreateProjectDtoRequest,
  ) {
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
      }),
    );
    if (!projectRes.success) {
      throw new HttpException(projectRes.error, HttpStatus.BAD_REQUEST);
    }
    return CreateProjectResponseDto.toResponse(projectRes.value);
  }

  @Patch(':id')
  @UseGuards(GithubAuthGuard)
  @ApiOperation({ summary: 'Mettre à jour un projet' })
  @ApiCookieAuth('sAccessToken')
  @ApiParam({ name: 'id', description: 'ID du projet' })
  @ApiBody({
    description: 'Données de mise à jour',
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        description: { type: 'string' },
        shortDescription: { type: 'string' },
        techStacks: { type: 'array', items: { type: 'string' } },
        categories: { type: 'array', items: { type: 'string' } },
        keyFeatures: { type: 'array', items: { type: 'string' } },
        projectGoals: { type: 'array', items: { type: 'string' } },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Projet mis à jour',
    example: {
      id: '123e4567-e89b-12d3-a456-426614174000',
      title: 'Mon Projet (Updated)',
      description: 'Description mise à jour',
      shortDescription: 'Description courte mise à jour',
      ownerId: 'github_user123',
      techStacks: [
        { id: '1', name: 'React', iconUrl: 'https://reactjs.org/logo.svg' },
      ],
      categories: [{ id: '1', name: 'Développement Web' }],
      createdAt: '2025-01-15T10:30:00.000Z',
      updatedAt: '2025-01-20T14:45:00.000Z',
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Erreur de validation',
    example: { message: 'Title is required', statusCode: 400 },
  })
  @ApiResponse({
    status: 401,
    description: 'Non authentifié',
    example: { message: 'unauthorised', statusCode: 401 },
  })
  @ApiResponse({
    status: 404,
    description: 'Projet non trouvé',
    example: { message: 'Project not found', statusCode: 404 },
  })
  async updateProject(
    @Session('userId') ownerId: string,
    @Param('id') id: string,
    @Body() project: UpdateProjectDtoRequest,
  ) {
    const projectRes: Result<Project> = await this.commandBus.execute(
      new UpdateProjectCommand(id, ownerId, {
        title: project.title,
        description: project.description,
        shortDescription: project.shortDescription,
        externalLinks: project.externalLinks,
        techStacks: project.techStacks,
        categories: project.categories,
        keyFeatures: project.keyFeatures,
        projectGoals: project.projectGoals,
        projectRoles: project.projectRoles,
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
  @ApiOperation({ summary: 'Supprimer un projet' })
  @ApiCookieAuth('sAccessToken')
  @ApiParam({ name: 'id', description: 'ID du projet' })
  @ApiResponse({
    status: 200,
    description: 'Projet supprimé',
    example: { message: 'Project deleted successfully' },
  })
  @ApiResponse({
    status: 401,
    description: 'Non authentifié',
    example: { message: 'unauthorised', statusCode: 401 },
  })
  @ApiResponse({
    status: 403,
    description: 'Accès interdit',
    example: {
      message: 'You are not allowed to delete this project',
      statusCode: 403,
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Projet non trouvé',
    example: { message: 'Project not found', statusCode: 404 },
  })
  async deleteProject(
    @Session('userId') ownerId: string,
    @Param('id') id: string,
  ) {
    const result: Result<boolean> = await this.commandBus.execute(
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

  @Get(':projectId/applications')
  @ApiOperation({ summary: "Récupérer les candidatures d'un projet" })
  @ApiCookieAuth('sAccessToken')
  @ApiParam({ name: 'projectId', description: 'ID du projet' })
  @ApiResponse({
    status: 200,
    description: 'Liste des candidatures',
    example: [
      {
        userId: 'accfaebd-b8bb-479b-aa3e-e02509d86e1d',
        projectId: '108da791-6e48-47de-9a2b-b88f739e08a2',
        projectRoleTitle: 'Frontend Developer',
        projectRoleId: '6262e74b-24f0-4c7b-a03c-5ac853a512ab',
        status: 'PENDING',
        selectedKeyFeatures: ['Shopping Cart', 'User Auth'],
        selectedProjectGoals: ['Create smooth UX', 'Improve performance'],
        appliedAt: '2025-07-14T22:38:23.644Z',
        userProfile: {
          id: 'accfaebd-b8bb-479b-aa3e-e02509d86e1d',
          name: 'John Doe',
          avatarUrl: 'https://avatars.githubusercontent.com/u/123456789',
        },
      },
    ],
  })
  @ApiResponse({
    status: 400,
    description: 'Accès refusé',
    example: {
      message: 'You are not the owner of this project',
      statusCode: 400,
    },
  })
  async getProjectApplications(
    @Session('userId') userId: string,
    @Param('projectId') projectId: string,
  ) {
    const projectResult: Result<Project> = await this.queryBus.execute(
      new FindProjectByIdQuery(projectId),
    );
    if (!projectResult.success) {
      throw new HttpException(projectResult.error, HttpStatus.BAD_REQUEST);
    }
    const applications: Result<ProjectRoleApplication[]> =
      await this.queryBus.execute(
        new GetAllProjectApplicationsQuery({ projectId, userId }),
      );
    if (!applications.success) {
      throw new HttpException(applications.error, HttpStatus.BAD_REQUEST);
    }
    return applications.value;
  }
}
