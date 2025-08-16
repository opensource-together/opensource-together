import { GitHubOctokit } from '@/contexts/github/infrastructure/decorators/github-octokit.decorator';
import { GithubAuthGuard } from '@/contexts/github/infrastructure/guards/github-auth.guard';
import {
  Author,
  Contributor,
  LastCommit,
  RepositoryInfo,
} from '@/contexts/github/use-cases/ports/github-repository.port';
import { Project } from '@/contexts/project/domain/project.entity';
import { FindProjectByIdQuery } from '@/contexts/project/use-cases/queries/find-by-id/find-project-by-id.handler';
import { GetProjectsQuery } from '@/contexts/project/use-cases/queries/get-all/get-projects.handler';
import { Result } from '@/libs/result';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Logger,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import {
  ApiBody,
  ApiCookieAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Octokit } from '@octokit/rest';
import { PublicAccess, Session } from 'supertokens-nestjs';
import { CreateProjectDto } from './controllers/dto/create-project-request.dto';
import { CreateProjectResponseDto } from './controllers/dto/create-project-response.dto';
import { GetProjectByIdResponseDto } from './controllers/dto/get-project-by-id-response.dto';
import { GetProjectsResponseDto } from './controllers/dto/get-projects-response.dto';
import { UpdateProjectDtoRequest } from './controllers/dto/update-project-request.dto';
import { UpdateProjectResponseDto } from './controllers/dto/update-project-response.dto';
import { ProjectService } from './project.service';
import { ProjectValidationErrors } from '@/contexts/project/domain/project.entity';

@ApiTags('Projects')
@Controller('projects')
export class ProjectController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly projectService: ProjectService,
  ) {}

  @ApiOperation({ summary: 'Récupérer tous les projets' })
  @ApiResponse({
    status: 200,
    description: 'Liste des projets',
    example: [
      {
        owner: {
          id: 'github_user123',
          username: 'Lhourquin',
          login: 'Lhourquin',
          avatarUrl: 'https://avatars.githubusercontent.com/u/123456789?v=4',
          email: 'lhourquin@example.com',
          provider: 'github',
          createdAt: '2025-01-15T10:30:00.000Z',
          updatedAt: '2025-01-20T14:45:00.000Z',
        },
        id: '123e4567-e89b-12d3-a456-426614174000',
        title: 'E-commerce Platform',
        description: 'Modern e-commerce app with React',
        shortDescription: 'E-commerce with React & Node.js',
        ownerId: 'github_user123',
        techStacks: [
          {
            id: '1',
            name: 'React',
            iconUrl: 'https://reactjs.org/logo.svg',
            type: 'TECH',
          },
          {
            id: '2',
            name: 'Node.js',
            iconUrl: 'https://nodejs.org/logo.svg',
            type: 'TECH',
          },
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
                type: 'TECH',
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
        projectStats: {
          forks: 2,
          stars: 1,
          watchers: 1,
          openIssues: 1,
          commits: 4,
          lastCommit: {
            sha: '4f017368bdc6fe9ca8f4bac1b497e01d25562b6e',
            message: 'Merge pull request #2 from Jyzdcs/main\n\ntest',
            date: '2025-07-15T23:17:16Z',
            url: 'https://github.com/Lhourquin/projet-os/commit/4f017368bdc6fe9ca8f4bac1b497e01d25562b6e',
            author: {
              login: 'Lhourquin',
              avatar_url:
                'https://avatars.githubusercontent.com/u/45101981?v=4',
              html_url: 'https://github.com/Lhourquin',
            },
          },
          contributors: [
            {
              login: 'Lhourquin',
              avatar_url:
                'https://avatars.githubusercontent.com/u/45101981?v=4',
              html_url: 'https://github.com/Lhourquin',
              contributions: 3,
            },
            {
              login: 'Jyzdcs',
              avatar_url:
                'https://avatars.githubusercontent.com/u/123254210?v=4',
              html_url: 'https://github.com/Jyzdcs',
              contributions: 1,
            },
          ],
        },
      },
      {
        owner: {
          id: 'github_user456',
          username: 'Mac-Gyver',
          login: 'Mac-Gyver',
          avatarUrl: 'https://avatars.githubusercontent.com/u/123254210?v=4',
          email: 'macgyver@example.com',
          provider: 'github',
          createdAt: '2025-01-15T10:30:00.000Z',
          updatedAt: '2025-01-20T14:45:00.000Z',
        },
        id: '123e4567-e89b-12d3-a456-426614174001',
        title: 'E-commerce Platform',
        description: 'Modern e-commerce app with React',
        shortDescription: 'E-commerce with React & Node.js',
        ownerId: 'github_user456',
        techStacks: [
          {
            id: '1',
            name: 'React',
            iconUrl: 'https://reactjs.org/logo.svg',
            type: 'TECH',
          },
          {
            id: '2',
            name: 'Node.js',
            iconUrl: 'https://nodejs.org/logo.svg',
            type: 'TECH',
          },
        ],
        categories: [{ id: '2', name: 'Développement Web' }],
        keyFeatures: [
          {
            id: 'feature1',
            projectId: '123e4567-e89b-12d3-a456-426614174001',
            feature: 'Shopping Cart',
          },
        ],
        projectGoals: [
          {
            id: 'goal1',
            projectId: '123e4567-e89b-12d3-a456-426614174001',
            goal: 'Create smooth UX',
          },
        ],
        projectRoles: [
          {
            id: 'role1',
            projectId: '123e4567-e89b-12d3-a456-426614174001',
            title: 'Frontend Developer',
            description: 'React developer needed',
            isFilled: false,
            techStacks: [
              {
                id: '1',
                name: 'React',
                iconUrl: 'https://reactjs.org/logo.svg',
                type: 'TECH',
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
        projectStats: {
          forks: 2,
          stars: 1,
          watchers: 1,
          openIssues: 1,
          commits: 4,
          lastCommit: {
            sha: '4f017368bdc6fe9ca8f4bac1b497e01d25562b6e',
            message: 'Merge pull request #2 from Mac-Gyver/main\n\ntest',
            date: '2025-07-15T23:17:16Z',
            url: 'https://github.com/Mac-Gyver/projet-os/commit/4f017368bdc6fe9ca8f4bac1b497e01d25562b6e',
            author: {
              login: 'Mac-Gyver',
              avatar_url:
                'https://avatars.githubusercontent.com/u/45101981?v=4',
              html_url: 'https://github.com/Lhourquin',
            },
          },
          contributors: [
            {
              login: 'Mac-Gyver',
              avatar_url:
                'https://avatars.githubusercontent.com/u/123254210?v=4',
              html_url: 'https://github.com/Mac-Gyver',
              contributions: 3,
            },
            {
              login: 'Jyzdcs',
              avatar_url:
                'https://avatars.githubusercontent.com/u/123254210?v=4',
              html_url: 'https://github.com/Jyzdcs',
              contributions: 1,
            },
          ],
        },
      },
    ],
  })
  @ApiResponse({ status: 500, description: 'Erreur serveur' })
  @PublicAccess()
  @UseGuards(GithubAuthGuard)
  @Get()
  async getProjects(@GitHubOctokit() octokit?: Octokit) {
    const projects: Result<
      (Project & {
        author: {
          ownerId: string;
          name: string;
          avatarUrl: string;
        };
        repositoryInfo: RepositoryInfo;
        lastCommit: LastCommit;
        commits: number;
        contributors: Contributor[];
        project: Project;
      })[]
    > = await this.queryBus.execute(new GetProjectsQuery({ octokit: octokit }));
    if (!projects.success) {
      throw new HttpException(projects.error, HttpStatus.BAD_REQUEST);
    }
    return GetProjectsResponseDto.toResponse(projects.value);
  }

  // Route publique pour récupérer un projet par son ID
  @ApiOperation({ summary: 'Récupérer un projet par ID' })
  @ApiParam({ name: 'id', description: 'ID du projet' })
  @ApiResponse({
    status: 200,
    description: 'Détails du projet',
    example: {
      owner: {
        id: '4d9c454e-6932-464a-97fb-f7f64e2dad23',
        username: 'Lucalhost',
        login: 'Lucalhost',
        avatarUrl: 'https://avatars.githubusercontent.com/u/45101981?v=4',
        email: 'lucalhost@example.com',
        provider: 'github',
        createdAt: '2025-01-15T10:30:00.000Z',
        updatedAt: '2025-01-20T14:45:00.000Z',
      },
      id: '123e4567-e89b-12d3-a456-426614174000',
      title: 'E-commerce Platform',
      description: 'Modern e-commerce app with React and Node.js',
      shortDescription: 'E-commerce with React & Node.js',
      ownerId: '4d9c454e-6932-464a-97fb-f7f64e2dad23',
      techStacks: [
        {
          id: '1',
          name: 'React',
          iconUrl: 'https://reactjs.org/logo.svg',
          type: 'TECH',
        },
        {
          id: '2',
          name: 'Node.js',
          iconUrl: 'https://nodejs.org/logo.svg',
          type: 'TECH',
        },
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
              type: 'TECH',
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
      projectStats: {
        forks: 2,
        stars: 1,
        watchers: 1,
        openIssues: 1,
        commits: 4,
        lastCommit: {
          sha: '4f017368bdc6fe9ca8f4bac1b497e01d25562b6e',
          message: 'Merge pull request #2 from Jyzdcs/main\n\ntest',
          date: '2025-07-15T23:17:16Z',
          url: 'https://github.com/Lhourquin/projet-os/commit/4f017368bdc6fe9ca8f4bac1b497e01d25562b6e',
          author: {
            login: 'Lhourquin',
            avatar_url: 'https://avatars.githubusercontent.com/u/45101981?v=4',
            html_url: 'https://github.com/Lhourquin',
          },
        },
        contributors: [
          {
            login: 'Lhourquin',
            avatar_url: 'https://avatars.githubusercontent.com/u/45101981?v=4',
            html_url: 'https://github.com/Lhourquin',
            contributions: 3,
          },
          {
            login: 'Jyzdcs',
            avatar_url: 'https://avatars.githubusercontent.com/u/123254210?v=4',
            html_url: 'https://github.com/Jyzdcs',
            contributions: 1,
          },
        ],
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Projet non trouvé',
    example: { message: 'Project not found', statusCode: 404 },
  })
  @PublicAccess()
  @UseGuards(GithubAuthGuard)
  // @ApiCookieAuth('sAccessToken')
  @Get(':id')
  async getProject(
    @Param('id') id: string,
    @GitHubOctokit() octokit?: Octokit,
  ) {
    const projectRes: Result<
      {
        author: Author;
        project: Project;
        repositoryInfo: RepositoryInfo;
        lastCommit: LastCommit;
        contributors: Contributor[];
        commits: number;
      },
      string
    > = await this.queryBus.execute(
      new FindProjectByIdQuery({ id: id, octokit: octokit }),
    );
    if (!projectRes.success) {
      throw new HttpException(projectRes.error, HttpStatus.NOT_FOUND);
    }
    const { project, repositoryInfo, lastCommit, contributors, commits } =
      projectRes.value;
    return GetProjectByIdResponseDto.toResponse({
      project,
      repositoryInfo: repositoryInfo,
      lastCommit: lastCommit,
      contributors: contributors,
      commits: commits,
    });
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
    type: CreateProjectDto,
    description: 'Données du projet à créer',
  })
  @ApiResponse({
    status: 201,
    description: 'Projet créé',
    example: {
      id: '5f4cbe9b-1305-43a2-95ca-23d7be707717',
      ownerId: 'bedb6486-1cbb-4333-b541-59d4af7da7f5',
      owner: {
        id: 'bedb6486-1cbb-4333-b541-59d4af7da7f5',
        username: 'john_doe',
        login: 'john_doe',
        avatarUrl: 'https://avatars.githubusercontent.com/u/123456789?v=4',
        email: 'john@example.com',
        provider: 'github',
        createdAt: '2025-07-05T14:59:31.560Z',
        updatedAt: '2025-07-05T14:59:31.560Z',
      },
      title: 'Mon Projet',
      shortDescription: 'Description courte',
      description: 'Description du projet',
      externalLinks: [
        { type: 'github', url: 'https://github.com/user/mon-projet' },
      ],
      techStacks: [
        {
          id: '1',
          name: 'React',
          iconUrl: 'https://reactjs.org/logo.svg',
          type: 'TECH',
        },
        {
          id: '2',
          name: 'Node.js',
          iconUrl: 'https://nodejs.org/logo.svg',
          type: 'TECH',
        },
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
            {
              id: '1',
              name: 'React',
              iconUrl: 'https://reactjs.org/logo.svg',
              type: 'TECH',
            },
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
    @Query('method') method: string,
    @GitHubOctokit() octokit: Octokit,
    @Body() project: CreateProjectDto,
  ) {
    Logger.log({ image: project.image });
    const projectRes: Result<Project, string | ProjectValidationErrors> =
      await this.projectService.create({
        ownerId: ownerId,
        ...project,
        octokit: octokit,
        method: method,
      });
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
        keyFeatures: {
          type: 'array',
          items: {
            oneOf: [
              { type: 'string' },
              {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  projectId: { type: 'string' },
                  feature: { type: 'string' },
                },
                required: ['id', 'projectId', 'feature'],
              },
            ],
          },
        },
        projectGoals: {
          type: 'array',
          items: {
            oneOf: [
              { type: 'string' },
              {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  projectId: { type: 'string' },
                  goal: { type: 'string' },
                },
                required: ['id', 'projectId', 'goal'],
              },
            ],
          },
        },
        image: { type: 'string' },
        coverImages: { type: 'array', items: { type: 'string' } },
        readme: { type: 'string' },
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
      owner: {
        id: 'github_user123',
        username: 'john_doe',
        login: 'john_doe',
        avatarUrl: 'https://avatars.githubusercontent.com/u/123456789?v=4',
        email: 'john@example.com',
        provider: 'github',
        createdAt: '2025-01-15T10:30:00.000Z',
        updatedAt: '2025-01-20T14:45:00.000Z',
      },
      techStacks: [
        {
          id: '1',
          name: 'React',
          iconUrl: 'https://reactjs.org/logo.svg',
          type: 'TECH',
        },
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
    const projectRes: Result<Project, string | ProjectValidationErrors> =
      await this.projectService.update({
        id: id,
        ownerId: ownerId,
        projectProps: {
          title: project.title,
          description: project.description,
          shortDescription: project.shortDescription,
          externalLinks: project.externalLinks,
          techStacks: project.techStacks,
          categories: project.categories,
          keyFeatures: project.keyFeatures,
          projectGoals: project.projectGoals,
          image: project.image,
          coverImages: project.coverImages,
          readme: project.readme,
        },
      });

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
    const result: Result<boolean, string> = await this.projectService.delete({
      projectId: id,
      ownerId: ownerId,
    });

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
