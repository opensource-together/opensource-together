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
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
@Controller('projects')
@UseGuards(AuthGuard)
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Get()
  @ApiOperation({ summary: 'Récupérer tous les projets' })
  @ApiResponse({
    status: 200,
    description: 'Liste des projets',
    example: [
      {
        owner: {
          id: 'github_user123',
          name: 'Lhourquin',
          image: 'https://avatars.githubusercontent.com/u/123456789?v=4',
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
          name: 'Mac-Gyver',
          image: 'https://avatars.githubusercontent.com/u/123254210?v=4',
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
  @UseGuards(GithubAuthGuard)
  @Get()
  @Public()
  async findAll(@GitHubOctokit() octokit: Octokit) {
    const result = await this.projectService.findAll(octokit);
    if (!result.success) {
      throw new BadRequestException(result.error);
    }
    return result.value;
  }

  @ApiOperation({ summary: 'Créer un projet' })
  @ApiBody({ type: CreateProjectDto, description: 'Données du projet à créer' })
  @UseGuards(GithubAuthGuard)
  @Post()
  async createProject(
    @Session() session: UserSession,
    @Body() createProjectDto: CreateProjectDto,
    @GitHubOctokit() octokit: Octokit,
  ) {
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
        coverImages: createProjectDto.coverImages || [],
        readme: createProjectDto.readme || '',
        externalLinks: createProjectDto.externalLinks || [],
      },
      octokit,
    );
    if (!result.success) {
      throw new BadRequestException(result.error);
    }
    return result.value;
  }

  @ApiOperation({ summary: 'Récupérer un projet par ID' })
  @ApiResponse({
    status: 200,
    description: 'Détails du projet',
    example: {
      id: 'e214183d-bf0a-4818-9050-17d4905de4e8',
      owner: {
        id: 'GCJO6PXIysuDms1Od6W8TefrigEamAeP',
        name: 'Lucalhost',
        githubLogin: 'Lhourquin',
        image: 'https://avatars.githubusercontent.com/u/45101981?v=4',
      },
      title: 'test',
      description: 'project de test',
      image: '',
      coverImages: [],
      readme: '',
      categories: [{ id: '1', name: 'IA & Machine Learning' }],
      techStacks: [
        {
          id: '2',
          name: 'Next.js',
          iconUrl:
            'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nextjs/nextjs-original.svg',
          type: 'TECH',
        },
      ],
      projectRoles: [
        {
          id: 'e07b8ddb-7df8-451d-b8fb-141975e1f2ef',
          title: 'Frontend Developer',
          description: 'Développeur React expérimenté',
          techStacks: [
            {
              id: '2',
              name: 'Next.js',
              iconUrl:
                'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nextjs/nextjs-original.svg',
              type: 'TECH',
            },
          ],
        },
      ],
      externalLinks: [],
      createdAt: '2025-08-31T10:36:15.264Z',
      updatedAt: '2025-08-31T10:36:15.264Z',
      stats: {
        forks: 0,
        stars: 0,
        watchers: 0,
        openIssues: 0,
        commits: 0,
        lastCommit: {
          sha: '922ec728733c4a11b08bc99cfcc2d402f33f5484',
          message: 'first commit',
          date: '2025-08-31T10:38:46Z',
          url: 'https://github.com/Lhourquin/test/commit/922ec728733c4a11b08bc99cfcc2d402f33f5484',
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
            contributions: 2,
          },
        ],
      },
    },
  })
  @UseGuards(GithubAuthGuard)
  @Public()
  @Get(':id')
  async findById(@Param('id') id: string, @GitHubOctokit() octokit: Octokit) {
    const result = await this.projectService.findById(id, octokit);
    if (!result.success) {
      throw new HttpException(result.error, HttpStatus.NOT_FOUND);
    }
    return result.value;
  }

  @ApiOperation({ summary: 'Mettre à jour un projet' })
  @ApiBody({
    type: UpdateProjectDto,
    description: 'Données du projet à mettre à jour',
  })
  @ApiResponse({
    status: 200,
    description: 'Projet mis à jour avec succès',
    example: {
      id: 'e214183d-bf0a-4818-9050-17d4905de4e8',
      ownerId: 'GCJO6PXIysuDms1Od6W8TefrigEamAeP',
      title: 'test3',
      description: 'nouvelle description',
      image: '',
      coverImages: [],
      readme: '',
      categories: [
        {
          id: '3',
          name: 'Applications Mobile',
        },
        {
          id: '5',
          name: 'Jeux Vidéo',
        },
      ],
      techStacks: [
        {
          id: '2',
          name: 'Next.js',
          iconUrl:
            'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nextjs/nextjs-original.svg',
          type: 'TECH',
        },
        {
          id: '4',
          name: 'Vue.js',
          iconUrl:
            'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vuejs/vuejs-original.svg',
          type: 'TECH',
        },
      ],
      projectRoles: [
        {
          id: 'e07b8ddb-7df8-451d-b8fb-141975e1f2ef',
          title: 'Frontend Developer',
          description: 'Développeur React expérimenté',
          techStacks: [
            {
              id: '2',
              name: 'Next.js',
              iconUrl:
                'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nextjs/nextjs-original.svg',
              type: 'TECH',
            },
          ],
        },
        {
          id: '679f7647-c7d2-4991-b663-fe000d060327',
          title: 'Frontend Developer',
          description: 'Développeur React junior',
          techStacks: [
            {
              id: '2',
              name: 'Next.js',
              iconUrl:
                'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nextjs/nextjs-original.svg',
              type: 'TECH',
            },
          ],
        },
        {
          id: '13353136-d190-4ee0-a79e-7f41c9122f7d',
          title: 'Backend Developer',
          description: 'Développeur php junior',
          techStacks: [
            {
              id: '2',
              name: 'Next.js',
              iconUrl:
                'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nextjs/nextjs-original.svg',
              type: 'TECH',
            },
          ],
        },
      ],
      externalLinks: [
        {
          id: 'bdaf22c9-ec51-4449-b5ca-8a79f33949c2',
          type: 'github',
          url: 'https://github.com/lhourquin/test2',
        },
        {
          id: 'b3e01acd-c7e4-4815-bb04-0764ce9a64de',
          type: 'twitter',
          url: 'https://x.com/kalu',
        },
      ],
      createdAt: '2025-08-31T10:36:15.264Z',
      updatedAt: '2025-08-31T17:09:13.569Z',
    },
  })
  @UseGuards(GithubAuthGuard)
  @Patch(':id')
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
}
