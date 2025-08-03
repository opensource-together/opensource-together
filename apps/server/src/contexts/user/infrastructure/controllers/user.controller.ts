import { UpdateUserRequestDto } from '@/contexts/profile/infrastructure/controllers/dtos/update-user.request.dto';
import { Project } from '@/contexts/project/domain/project.entity';
import { FindProjectsByUserIdQuery } from '@/contexts/project/use-cases/queries/find-by-user-id/find-projects-by-user-id.handler';
import { User } from '@/contexts/user/domain/user.entity';
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
// import { PublicAccess, Session } from 'supertokens-nestjs';
import { Session, UserSession } from '@thallesp/nestjs-better-auth';

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
  async getMyProfile(@Session() session: UserSession) {
    const userId = session.user.id;
    console.log('userId', userId);
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
  @ApiOperation({ summary: 'Get all applications for a user' })
  @ApiResponse({
    status: 200,
    description: 'Liste des candidatures',
    example: [
      {
        appplicationId: '672e9a56-e22c-4848-b68d-2c2845b7a7ba',
        projectRoleId: '15858a85-6d77-4065-b479-afa34395610f',
        projectRoleTitle: 'Dev front',
        status: 'PENDING',
        selectedKeyFeatures: ['auth'],
        selectedProjectGoals: ['progres'],
        appliedAt: '2025-07-22T13:08:06.914Z',
        decidedAt: '2025-07-22T14:35:48.838Z',
        decidedBy: '',
        rejectionReason: '',
        motivationLetter: 'Je vais faire ca et ci etc ca',
      },
    ],
  })
  async getApplications(@Session('userId') userId: string) {
    const applications: Result<
      {
        appplicationId: string;
        projectRoleId: string;
        projectTitle: string;
        projectDescription: string;
        projectRoleTitle: string;
        projectRoleDescription: string;
        status: string;
        selectedKeyFeatures: string[];
        selectedProjectGoals: string[];
        appliedAt: Date;
        decidedAt: Date;
        decidedBy: string;
        rejectionReason: string;
        motivationLetter: string;
      }[]
    > = await this.queryBus.execute(new FindUserApplicationsQuery({ userId }));

    if (!applications.success) {
      throw new HttpException(applications.error, HttpStatus.BAD_REQUEST);
    }

    return applications.value;
  }

  //PUBLIC ENDPOINTS
  // @PublicAccess()
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

  // @PublicAccess()
  @Get(':userId/projects')
  @ApiOperation({ summary: "Récupérer les projets d'un utilisateur" })
  @ApiParam({
    name: 'userId',
    description: "ID de l'utilisateur",
    example: '43a39f90-1718-470d-bcef-c7ebeb972c0d',
  })
  @ApiResponse({
    status: 200,
    description: 'Projets retournés avec succès',
  })
  @ApiResponse({
    status: 404,
    description: 'Utilisateur non trouvé',
  })
  async getUserProjects(@Param('userId') userId: string) {
    const result: Result<Project[], string> = await this.queryBus.execute(
      new FindProjectsByUserIdQuery(userId),
    );

    if (!result.success) {
      throw new NotFoundException(result.error);
    }

    return result.value.map((_) => _.toPrimitive());
  }
}
