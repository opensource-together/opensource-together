import { UpdateUserRequestDto } from '@/contexts/profile/infrastructure/controllers/dtos/update-user.request.dto';
import { ProjectRoleApplication } from '@/contexts/project/bounded-contexts/project-role-application/domain/project-role-application.entity';
import { GetAllApplicationsByProjectsOwnerQuery } from '@/contexts/project/bounded-contexts/project-role-application/use-cases/queries/get-all-applications-by-projects-owner.query';
import { CancelApplicationCommand } from '@/contexts/project/bounded-contexts/project-role-application/use-cases/commands/cancel-application.command';
import { FindUserProjectsWithDetailsQuery } from '@/contexts/project/use-cases/queries/find-user-projects-with-details/find-user-projects-with-details.handler';
import { User } from '@/contexts/user/domain/user.entity';
import { ProjectWithDetails } from '@/contexts/project/infrastructure/repositories/prisma.project.mapper';
import { CalculateGitHubStatsUseCase } from '@/contexts/user/use-cases/calculate-github-stats.use-case';
import { DeleteUserCommand } from '@/contexts/user/use-cases/commands/delete-user.command';
import { UpdateUserCommand } from '@/contexts/user/use-cases/commands/update-user.command';
import { FindUserApplicationsQuery } from '@/contexts/user/use-cases/queries/find-user-applications.query';
import { FindUserByIdQuery } from '@/contexts/user/use-cases/queries/find-user-by-id.query';
import { Result } from '@/libs/result';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
  Query,
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
import { PublicAccess, Session } from 'supertokens-nestjs';
import { CancelApplicationRequestDto } from './dto/cancel-application-request.dto';

// DTO simple pour la mise à jour d'utilisateur
// export class UpdateUserRequestDto {
//   username?: string;
//   avatarUrl?: string;
//   bio?: string;
//   location?: string;
//   company?: string;
//   socialLinks?: {
//     github?: string;
//     website?: string;
//     twitter?: string;
//     linkedin?: string;
//     discord?: string;
//   };
//   techStacks?: string[];
//   experiences?: {
//     company: string;
//     position: string;
//     startDate: string;
//     endDate?: string;
//   }[];
//   projects?: { name: string; description: string; url: string }[];
// }

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
    private readonly calculateGitHubStatsUseCase: CalculateGitHubStatsUseCase,
  ) {}

  //PRIVATE ENDPOINTS

  @Get('me')
  @ApiOperation({ summary: "Récupérer le profil de l'utilisateur courant" })
  @ApiCookieAuth('sAccessToken')
  @ApiResponse({
    status: 200,
    description: 'Profil utilisateur retourné avec succès',
    example: {
      id: '936d4402-83ff-4be1-a3f7-6e5fba8fa052',
      username: 'Lhourquin',
      email: 'lhourquin@gmail.com',
      login: 'Lhourquin',
      avatarUrl: 'https://avatars.githubusercontent.com/u/45101981?v=4',
      location: '',
      company: '',
      bio: 'Fullstack Developer | \r\nNestJS & Angular lover | \r\nBuilding @opensource-together ',
      jobTitle: 'Senior Fullstack Developer',
      socialLinks: {},
      techStacks: [],
      provider: 'google',
      experiences: [],
      projects: [],
      createdAt: '2025-07-29T08:07:32.845Z',
      updatedAt: '2025-07-29T08:07:32.845Z',
      githubStats: {
        totalStars: 150,
        contributedRepos: 25,
        commitsThisYear: 380,
        contributionGraph: {
          weeks: [
            {
              days: [
                { date: '2025-01-01', count: 0, level: 0 },
                { date: '2025-01-02', count: 3, level: 2 },
                { date: '2025-01-03', count: 5, level: 3 },
                { date: '2025-01-04', count: 2, level: 1 },
                { date: '2025-01-05', count: 8, level: 4 },
                { date: '2025-01-06', count: 1, level: 1 },
                { date: '2025-01-07', count: 0, level: 0 },
              ],
            },
            // ... autres semaines
          ],
          totalContributions: 380,
          maxContributions: 12,
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Utilisateur non trouvé',
  })
  async getMyProfile(@Session('userId') userId: string) {
    const result: Result<User, string> = await this.queryBus.execute(
      new FindUserByIdQuery({
        userId,
        authenticatedUserId: userId,
      }),
    );

    if (!result.success) {
      throw new NotFoundException(result.error);
    }

    const user = result.value;
    const userPrimitive = user.toPrimitive();

    // Vérifier si l'utilisateur s'est connecté via GitHub
    if (userPrimitive.provider === 'github') {
      // Calculer les statistiques GitHub seulement si le provider est GitHub
      try {
        const githubStatsResult =
          await this.calculateGitHubStatsUseCase.execute(userId);
        if (githubStatsResult.success) {
          userPrimitive.githubStats = githubStatsResult.value;
        } else {
          // Si pas de credentials GitHub ou erreur, utiliser des stats à 0
          userPrimitive.githubStats = {
            totalStars: 0,
            contributedRepos: 0,
            commitsThisYear: 0,
            contributionGraph: {
              weeks: [],
              totalContributions: 0,
              maxContributions: 0,
            },
          };
        }
      } catch {
        // En cas d'erreur, utiliser des stats à 0
        userPrimitive.githubStats = {
          totalStars: 0,
          contributedRepos: 0,
          commitsThisYear: 0,
          contributionGraph: {
            weeks: [],
            totalContributions: 0,
            maxContributions: 0,
          },
        };
      }
    } else {
      // Si le provider n'est pas GitHub, attribuer undefined aux githubStats
      userPrimitive.githubStats = null;
    }

    return userPrimitive;
  }

  @Patch('me')
  @ApiOperation({ summary: "Mettre à jour le profil de l'utilisateur courant" })
  @ApiCookieAuth('sAccessToken')
  @ApiBody({
    description: 'Données de mise à jour du profil',
    type: UpdateUserRequestDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Profil mis à jour avec succès',
  })
  @ApiResponse({
    status: 400,
    description: 'Erreur de validation',
  })
  @ApiResponse({
    status: 404,
    description: 'Utilisateur non trouvé',
  })
  async updateMyProfile(
    @Session('userId') userId: string,
    @Body() updateUserDto: UpdateUserRequestDto,
  ) {
    const result: Result<User, string> = await this.commandBus.execute(
      new UpdateUserCommand(userId, updateUserDto),
    );

    if (!result.success) {
      if (result.error === 'User not found') {
        throw new NotFoundException(result.error);
      }
      throw new HttpException(result.error, HttpStatus.BAD_REQUEST);
    }

    return result.value.toPrimitive();
  }

  @Delete('me')
  @ApiOperation({ summary: "Supprimer le profil de l'utilisateur courant" })
  @ApiCookieAuth('sAccessToken')
  @ApiResponse({
    status: 200,
    description: 'Utilisateur supprimé avec succès',
    example: {
      message: 'User deleted successfully',
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Utilisateur non trouvé',
  })
  async deleteMyProfile(
    @Session('userId') userId: string,
  ): Promise<{ message: string }> {
    const result: Result<void, string> = await this.commandBus.execute(
      new DeleteUserCommand(userId),
    );

    if (!result.success) {
      if (result.error === 'User not found') {
        throw new NotFoundException(result.error);
      }
      throw new HttpException(result.error, HttpStatus.BAD_REQUEST);
    }

    return { message: 'User deleted successfully' };
  }

  @Get('me/applications')
  @ApiCookieAuth('sAccessToken')
  @ApiOperation({
    summary: 'Get all applications for a user',
    description:
      "Récupère les candidatures de l'utilisateur. Si type=owner, retourne les candidatures reçues pour ses projets. Sinon, retourne les candidatures soumises par l'utilisateur.",
  })
  @ApiResponse({
    status: 200,
    description: 'Liste des candidatures',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          applicationId: { type: 'string' },
          projectRoleId: { type: 'string' },
          projectRoleTitle: { type: 'string' },
          project: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              title: { type: 'string' },
              shortDescription: { type: 'string' },
              image: { type: 'string', nullable: true },
              author: {
                type: 'object',
                properties: {
                  ownerId: { type: 'string' },
                  name: { type: 'string' },
                  avatarUrl: { type: 'string', nullable: true },
                },
              },
            },
          },
          projectRole: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              projectId: { type: 'string', nullable: true },
              title: { type: 'string' },
              description: { type: 'string' },
              techStacks: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    id: { type: 'string' },
                    name: { type: 'string' },
                    iconUrl: { type: 'string', nullable: true },
                  },
                },
              },
              roleCount: { type: 'number', nullable: true },
              projectGoal: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    id: { type: 'string', nullable: true },
                    projectId: { type: 'string', nullable: true },
                    goal: { type: 'string' },
                  },
                },
                nullable: true,
              },
            },
          },
          status: {
            type: 'string',
            enum: ['PENDING', 'ACCEPTED', 'REJECTED', 'CANCELLED'],
          },
          selectedKeyFeatures: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                feature: { type: 'string' },
              },
            },
          },
          selectedProjectGoals: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                goal: { type: 'string' },
              },
            },
          },
          appliedAt: { type: 'string', format: 'date-time' },
          decidedAt: { type: 'string', format: 'date-time' },
          decidedBy: { type: 'string', nullable: true },
          rejectionReason: { type: 'string', nullable: true },
          motivationLetter: { type: 'string' },
          userProfile: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              name: { type: 'string' },
              avatarUrl: { type: 'string', nullable: true },
            },
          },
        },
      },
    },
    example: [
      {
        applicationId: 'd78b2322-65db-4c8b-a2d0-6cf65afae882',
        projectRoleId: '3715420c-d33e-4541-8e9a-e547eb169ba1',
        projectRoleTitle: 'Dev back',
        project: {
          id: '0247bb88-93cc-408d-8635-d149fa5b7604',
          title: 'studydi',
          shortDescription: 'Application de révision interactive',
          image: 'https://example.com/project-image.jpg',
          author: {
            ownerId: '936d4402-83ff-4be1-a3f7-6e5fba8fa052',
            name: 'Lucalhost',
            avatarUrl: 'https://avatars.githubusercontent.com/u/45101981?v=4',
          },
        },
        projectRole: {
          id: '3715420c-d33e-4541-8e9a-e547eb169ba1',
          projectId: '0247bb88-93cc-408d-8635-d149fa5b7604',
          title: 'Dev back',
          description: 'Développement backend avec Node.js et Express',
          techStacks: [
            {
              id: 'tech-1',
              name: 'Node.js',
              iconUrl: 'https://example.com/nodejs.svg',
            },
            {
              id: 'tech-2',
              name: 'Express',
              iconUrl: 'https://example.com/express.svg',
            },
          ],
          roleCount: 1,
          projectGoal: [
            {
              id: 'goal-1',
              projectId: '0247bb88-93cc-408d-8635-d149fa5b7604',
              goal: 'Créer une API REST robuste',
            },
          ],
        },
        status: 'PENDING',
        selectedKeyFeatures: [
          {
            feature: 'auth',
          },
        ],
        selectedProjectGoals: [
          {
            goal: 'app de revision',
          },
        ],
        appliedAt: '2025-07-29T09:07:15.289Z',
        decidedAt: '2025-07-29T18:14:27.974Z',
        decidedBy: null,
        rejectionReason: null,
        motivationLetter:
          'dfsajhksadfhjkasdfhjkdsafghjkdgsahkjadgshjksadfgklhj',
        userProfile: {
          id: '936d4402-83ff-4be1-a3f7-6e5fba8fa052',
          name: 'Lucalhost',
          avatarUrl: 'https://avatars.githubusercontent.com/u/45101981?v=4',
        },
      },
    ],
  })
  async getApplications(
    @Session('userId') userId: string,
    @Query('type') type?: 'owner' | 'candidate',
  ) {
    // Si type=owner, récupérer les candidatures reçues pour les projets de l'utilisateur
    if (type === 'owner') {
      const applications: Result<ProjectRoleApplication[], string> =
        await this.queryBus.execute(
          new GetAllApplicationsByProjectsOwnerQuery(userId),
        );
      if (!applications.success) {
        throw new HttpException(applications.error, HttpStatus.BAD_REQUEST);
      }
      return applications.value;
    }

    // Sinon, récupérer les candidatures soumises par l'utilisateur (comportement par défaut)
    const applications: Result<
      {
        applicationId: string;
        projectRoleId: string;
        projectRoleTitle: string;
        project: {
          id: string;
          title: string;
          shortDescription: string;
          image?: string;
          author: {
            ownerId: string;
            name: string;
            avatarUrl?: string;
          };
        };
        projectRole: {
          id: string;
          projectId?: string;
          title: string;
          description: string;
          techStacks: {
            id: string;
            name: string;
            iconUrl?: string;
          }[];
          roleCount?: number;
          projectGoal?: {
            id?: string;
            projectId?: string;
            goal: string;
          }[];
        };
        status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'CANCELLED';
        selectedKeyFeatures: {
          feature: string;
        }[];
        selectedProjectGoals: {
          goal: string;
        }[];
        appliedAt: Date;
        decidedAt: Date;
        decidedBy?: string;
        rejectionReason?: string;
        motivationLetter: string;
        userProfile: {
          id: string;
          name: string;
          avatarUrl?: string;
        };
      }[]
    > = await this.queryBus.execute(new FindUserApplicationsQuery({ userId }));

    if (!applications.success) {
      throw new HttpException(applications.error, HttpStatus.BAD_REQUEST);
    }

    return applications.value;
  }

  @Patch('me/applications/:id')
  @ApiOperation({ summary: 'Cancel an application' })
  @ApiParam({ name: 'id', description: 'Application ID' })
  @ApiBody({
    description: 'Cancel application data',
    schema: {
      type: 'object',
      properties: {
        cancel: {
          type: 'boolean',
          description: 'Set to true to cancel the application',
        },
      },
      required: ['cancel'],
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Application cancelled successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Application cannot be cancelled',
  })
  @ApiResponse({
    status: 404,
    description: 'Application not found',
  })
  async cancelApplication(
    @Param('id') id: string,
    @Session('userId') userId: string,
    @Body() body: CancelApplicationRequestDto,
  ) {
    if (!body.cancel) {
      throw new HttpException(
        'Cancel must be true to cancel application',
        HttpStatus.BAD_REQUEST,
      );
    }

    const result: Result<void, string> = await this.commandBus.execute(
      new CancelApplicationCommand({ applicationId: id, userId }),
    );

    if (!result.success) {
      throw new HttpException(result.error, HttpStatus.BAD_REQUEST);
    }

    return { message: 'Application cancelled successfully' };
  }

  //PUBLIC ENDPOINTS
  @PublicAccess()
  @Get(':id')
  @ApiOperation({ summary: 'Récupérer un utilisateur par son ID' })
  @ApiParam({
    name: 'id',
    description: "ID de l'utilisateur",
    example: '43a39f90-1718-470d-bcef-c7ebeb972c0d',
  })
  @ApiResponse({
    status: 200,
    description: 'Utilisateur retourné avec succès',
  })
  @ApiResponse({
    status: 404,
    description: 'Utilisateur non trouvé',
  })
  async getUserById(@Param('id') id: string) {
    const result: Result<
      Omit<User, 'email' | 'login'>,
      string
    > = await this.queryBus.execute(
      new FindUserByIdQuery({
        userId: id,
        authenticatedUserId: '',
      }),
    );

    if (!result.success) {
      throw new NotFoundException(result.error);
    }

    const userPrimitive = result.value.toPrimitive();

    // Vérifier si l'utilisateur s'est connecté via GitHub
    if (userPrimitive.provider === 'github') {
      // Calculer les statistiques GitHub seulement si le provider est GitHub
      try {
        const githubStatsResult =
          await this.calculateGitHubStatsUseCase.execute(id);
        if (githubStatsResult.success) {
          userPrimitive.githubStats = githubStatsResult.value;
        } else {
          // Si pas de credentials GitHub ou erreur, utiliser des stats à 0
          userPrimitive.githubStats = {
            totalStars: 0,
            contributedRepos: 0,
            commitsThisYear: 0,
            contributionGraph: {
              weeks: [],
              totalContributions: 0,
              maxContributions: 0,
            },
          };
        }
      } catch {
        // En cas d'erreur, utiliser des stats à 0
        userPrimitive.githubStats = {
          totalStars: 0,
          contributedRepos: 0,
          commitsThisYear: 0,
          contributionGraph: {
            weeks: [],
            totalContributions: 0,
            maxContributions: 0,
          },
        };
      }
    } else {
      // Si le provider n'est pas GitHub, attribuer undefined aux githubStats
      userPrimitive.githubStats = null;
    }

    return userPrimitive;
  }

  @Get('me/projects')
  @ApiOperation({
    summary:
      "Récupérer les projets de l'utilisateur courant avec tous les détails",
  })
  @ApiCookieAuth('sAccessToken')
  @ApiResponse({
    status: 200,
    description: 'Projets avec détails retournés avec succès',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          title: { type: 'string' },
          shortDescription: { type: 'string' },
          description: { type: 'string' },
          image: { type: 'string', nullable: true },
          status: { type: 'string' },
          owner: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              username: { type: 'string' },
              avatarUrl: { type: 'string', nullable: true },
            },
          },
          techStacks: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                name: { type: 'string' },
                iconUrl: { type: 'string' },
              },
            },
          },
          teamMembers: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                name: { type: 'string' },
                avatarUrl: { type: 'string', nullable: true },
                role: { type: 'string' },
                joinedAt: { type: 'string', format: 'date-time' },
                techStacks: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      id: { type: 'string' },
                      name: { type: 'string' },
                      iconUrl: { type: 'string', nullable: true },
                    },
                  },
                },
              },
            },
          },
          applications: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                status: { type: 'string' },
                applicant: {
                  type: 'object',
                  properties: {
                    id: { type: 'string' },
                    name: { type: 'string' },
                    avatarUrl: { type: 'string', nullable: true },
                    skills: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          id: { type: 'string' },
                          name: { type: 'string' },
                          iconUrl: { type: 'string' },
                        },
                      },
                    },
                  },
                },
                projectRole: {
                  type: 'object',
                  properties: {
                    id: { type: 'string' },
                    title: { type: 'string' },
                    description: { type: 'string' },
                    techStacks: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          id: { type: 'string' },
                          name: { type: 'string' },
                          iconUrl: { type: 'string' },
                        },
                      },
                    },
                  },
                },
                appliedAt: { type: 'string', format: 'date-time' },
                decidedAt: {
                  type: 'string',
                  format: 'date-time',
                  nullable: true,
                },
                decidedBy: { type: 'string', nullable: true },
                motivationLetter: { type: 'string' },
                selectedKeyFeatures: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      id: { type: 'string' },
                      feature: { type: 'string' },
                    },
                  },
                },
                selectedProjectGoals: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      id: { type: 'string' },
                      goal: { type: 'string' },
                    },
                  },
                },
                rejectionReason: { type: 'string', nullable: true },
              },
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Utilisateur non trouvé',
  })
  async getMyProjectsWithDetails(@Session('userId') userId: string) {
    const result: Result<ProjectWithDetails[], string> =
      await this.queryBus.execute(new FindUserProjectsWithDetailsQuery(userId));

    if (!result.success) {
      throw new NotFoundException(result.error);
    }

    // Transformer les données pour correspondre au format attendu par le frontend
    const projectsWithDetails = result.value.map((projectWithDetails) => {
      const project = projectWithDetails.project;
      const projectPrimitive = project.toPrimitive();

      // Transformer les applications pour correspondre au format attendu
      const applications = projectWithDetails.projectRoleApplication.map(
        (application) => ({
          id: application.id,
          status: application.status,
          applicant: {
            id: application.user.id,
            name: application.user.username,
            avatarUrl: application.user.avatarUrl,
            skills: application.user.techStacks || [],
          },
          projectRole: {
            id: application.projectRole.id,
            title: application.projectRole.title,
            description: application.projectRole.description,
            techStacks: application.projectRole.techStacks || [],
          },
          appliedAt: application.appliedAt,
          decidedAt: application.decidedAt,
          decidedBy: application.decidedBy,
          motivationLetter: application.motivationLetter || '',
          selectedKeyFeatures: application.selectedKeyFeatures || [],
          selectedProjectGoals: application.selectedProjectGoals || [],
          rejectionReason: application.rejectionReason,
        }),
      );

      // Transformer les membres d'équipe
      const teamMembers = projectWithDetails.projectMembers.map((member) => ({
        id: member.id,
        name: member.user?.username || 'Unknown',
        avatarUrl: member.user?.avatarUrl,
        role: member.projectRole?.[0]?.title || 'Member',
        joinedAt: member.joinedAt,
        techStacks: member.user?.techStacks || [],
      }));

      return {
        id: projectPrimitive.id,
        title: projectPrimitive.title,
        shortDescription: projectPrimitive.shortDescription,
        description: projectPrimitive.description,
        image: projectPrimitive.image,
        status: 'PUBLISHED', // À adapter selon votre logique métier
        owner: {
          id: projectPrimitive.owner?.id || '',
          username: projectPrimitive.owner?.username || '',
          avatarUrl: projectPrimitive.owner?.avatarUrl || '',
        },
        techStacks: projectPrimitive.techStacks || [],
        teamMembers,
        applications,
      };
    });

    return projectsWithDetails;
  }
}
