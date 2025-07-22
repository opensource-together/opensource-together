import { ProfileResponseDto } from '@/contexts/profile/infrastructure/controllers/dtos/profile-response.dto';
import { ProfileMapper } from '@/contexts/profile/infrastructure/controllers/mappers/profile.mapper';
import {
  FindProfileByIdQuery,
  FullProfileData,
} from '@/contexts/profile/use-cases/queries/find-profile-by-id.query';
import { Project } from '@/contexts/project/domain/project.entity';
import { GetProjectsByUserIdResponseDto } from '@/contexts/project/infrastructure/controllers/dto/get-projects-by-user-id-response.dto';
import { FindProjectsByUserIdQuery } from '@/contexts/project/use-cases/queries/find-by-user-id/find-projects-by-user-id.handler';
import { UpdateProfileCommand } from '@/contexts/profile/use-cases/commands/update-profile.command';
import { DeleteProfileCommand } from '@/contexts/profile/use-cases/commands/delete-profile.command';
import { UpdateProfileRequestDto } from '@/contexts/profile/infrastructure/controllers/dtos/update-profile-request.dto';
import { UpdateProfileResponseDto } from '@/contexts/profile/infrastructure/controllers/dtos/update-profile-response.dto';
import { Profile } from '@/contexts/profile/domain/profile.entity';
import { Result } from '@/libs/result';
import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
  Delete,
  Body,
  ForbiddenException,
} from '@nestjs/common';
import { QueryBus, CommandBus } from '@nestjs/cqrs';
import {
  ApiCookieAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
  ApiBody,
} from '@nestjs/swagger';
import { PublicAccess, Session } from 'supertokens-nestjs';

@ApiTags('Profile')
@Controller('profile')
export class ProfileController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  @Get('me')
  @ApiOperation({ summary: "Récupérer le profil de l'utilisateur courant" })
  @ApiCookieAuth('sAccessToken')
  @ApiResponse({
    status: 200,
    description: 'Profil utilisateur retourné avec succès',
    example: {
      id: '43a39f90-1718-470d-bcef-c7ebeb972c0d',
      name: 'Jhondoe',
      avatarUrl: 'https://avatars.githubusercontent.com/u/45101981?v=4',
      bio: 'Fullstack Developer | \r\nExpress & React | \r\nBuilding @jhongo-project ',
      location: 'Paris, France',
      company: 'Jhongo',
      socialLinks: [
        { type: 'github', url: 'https://github.com/Jhondoe' },
        { type: 'twitter', url: 'https://twitter.com/Jhondoe' },
        { type: 'linkedin', url: 'https://www.linkedin.com/in/jhondoe/' },
        { type: 'website', url: 'https://jhondoe.com' },
      ],
      skills: [],
      experiences: [],
      joinedAt: '2025-04-16T15:47:31.633Z',
      profileUpdatedAt: '2025-04-16T15:47:31.633Z',
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Utilisateur non trouvé',
    example: {
      message: 'Utilisateur non trouvé.',
      error: 'Not Found',
      statusCode: 404,
    },
  })
  async getMyProfile(
    @Session('userId') userId: string,
  ): Promise<ProfileResponseDto> {
    return this.getProfileById(userId);
  }

  @PublicAccess()
  @Get(':profileId/projects')
  @ApiOperation({ summary: "Récupérer tous les projets d'un profil" })
  @ApiParam({
    name: 'profileId',
    description: 'ID du profil dont on veut récupérer les projets',
    example: '43a39f90-1718-470d-bcef-c7ebeb972c0d',
  })
  @ApiResponse({
    status: 200,
    description: 'Liste des projets du profil',
    example: {
      projects: [
        {
          id: '123e4567-e89b-12d3-a456-426614174000',
          title: 'Projet E-commerce',
          description: 'Application e-commerce moderne avec React',
          shortDescription: 'E-commerce avec React et Node.js',
          ownerId: '43a39f90-1718-470d-bcef-c7ebeb972c0d',
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
              feature: 'Panier dynamique',
            },
          ],
          projectGoals: [
            {
              id: 'goal1',
              projectId: '123e4567-e89b-12d3-a456-426614174000',
              goal: 'Créer une expérience utilisateur fluide',
            },
          ],
          projectRoles: [
            {
              id: 'role1',
              projectId: '123e4567-e89b-12d3-a456-426614174000',
              title: 'Frontend Developer',
              description: 'Développeur React expérimenté',
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
            {
              type: 'github',
              url: 'https://github.com/johndoe/ecommerce-project',
            },
          ],
          createdAt: '2025-01-15T10:30:00.000Z',
          updatedAt: '2025-01-20T14:45:00.000Z',
        },
      ],
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Erreur lors de la récupération des projets',
    example: {
      message: 'Error retrieving projects for profile',
      statusCode: 400,
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Profil non trouvé',
    example: {
      message: 'Profile not found',
      statusCode: 404,
    },
  })
  async getProjectsByProfileId(@Param('profileId') profileId: string) {
    const result: Result<Project[], string> = await this.queryBus.execute(
      new FindProjectsByUserIdQuery(profileId),
    );

    if (!result.success) {
      throw new HttpException(result.error, HttpStatus.BAD_REQUEST);
    }

    return GetProjectsByUserIdResponseDto.toResponse(result.value);
  }

  @PublicAccess()
  @Get(':id')
  @ApiOperation({ summary: 'Récupérer un profil par son ID' })
  @ApiParam({
    name: 'id',
    description: "ID de l'utilisateur dont on veut récupérer le profil",
    example: '43a39f90-1718-470d-bcef-c7ebeb972c0d',
  })
  @ApiResponse({
    status: 200,
    description: 'Profil utilisateur retourné avec succès',
    example: {
      id: '43a39f90-1718-470d-bcef-c7ebeb972c0d',
      name: 'John Doe',
      avatarUrl: 'https://avatars.githubusercontent.com/u/45101981?v=4',
      bio: 'Fullstack Developer | \r\nExpress & React | \r\nBuilding @awesome-project ',
      location: 'Paris, France',
      company: 'Tech Corp',
      socialLinks: [
        { type: 'github', url: 'https://github.com/johndoe' },
        { type: 'twitter', url: 'https://twitter.com/johndoe' },
        { type: 'linkedin', url: 'https://www.linkedin.com/in/johndoe/' },
        { type: 'website', url: 'https://johndoe.com' },
      ],
      skills: [],
      experiences: [],
      projects: [],
      joinedAt: '2025-04-16T15:47:31.633Z',
      profileUpdatedAt: '2025-04-16T15:47:31.633Z',
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Profil non trouvé',
    example: {
      message: 'Profile not found',
      error: 'Not Found',
      statusCode: 404,
    },
  })
  async getProfileById(@Param('id') id: string): Promise<ProfileResponseDto> {
    const findProfileByIdQuery = new FindProfileByIdQuery(id);
    const findProfileByIdQueryResult: Result<FullProfileData, string> =
      await this.queryBus.execute(findProfileByIdQuery);

    if (!findProfileByIdQueryResult.success) {
      throw new NotFoundException(findProfileByIdQueryResult.error);
    }

    return ProfileMapper.toDto(findProfileByIdQueryResult.value);
  }

  @Patch('me')
  @ApiOperation({ summary: 'Mettre à jour le profil de l\'utilisateur courant' })
  @ApiCookieAuth('sAccessToken')
  @ApiBody({
    description: 'Données de mise à jour du profil',
    type: UpdateProfileRequestDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Profil mis à jour avec succès',
    example: {
      id: '43a39f90-1718-470d-bcef-c7ebeb972c0d',
      name: 'John Doe Updated',
      avatarUrl: 'https://avatars.githubusercontent.com/u/45101981?v=4',
      bio: 'Updated bio',
      location: 'Lyon, France',
      company: 'New Tech Corp',
      socialLinks: [
        { type: 'github', url: 'https://github.com/johndoe' },
        { type: 'twitter', url: 'https://twitter.com/johndoe' },
      ],
      skills: [],
      experiences: [],
      joinedAt: '2025-04-16T15:47:31.633Z',
      profileUpdatedAt: '2025-04-17T10:30:00.000Z',
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Erreur de validation',
    example: {
      message: 'Bio must be less than 1000 characters.',
      statusCode: 400,
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Profil non trouvé',
    example: {
      message: 'Profile not found',
      statusCode: 404,
    },
  })
  async updateMyProfile(
    @Session('userId') userId: string,
    @Body() updateProfileDto: UpdateProfileRequestDto,
  ): Promise<ProfileResponseDto> {
    const result: Result<Profile, string> = await this.commandBus.execute(
      new UpdateProfileCommand(userId, updateProfileDto),
    );

    if (!result.success) {
      if (result.error === 'Profile not found') {
        throw new NotFoundException(result.error);
      }
      throw new HttpException(result.error, HttpStatus.BAD_REQUEST);
    }

    return UpdateProfileResponseDto.toResponse(result.value);
  }

  @Delete('me')
  @ApiOperation({ summary: 'Supprimer le profil de l\'utilisateur courant' })
  @ApiCookieAuth('sAccessToken')
  @ApiResponse({
    status: 200,
    description: 'Profil supprimé avec succès',
    example: {
      message: 'Profile deleted successfully',
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Profil non trouvé',
    example: {
      message: 'Profile not found',
      statusCode: 404,
    },
  })
  async deleteMyProfile(
    @Session('userId') userId: string,
  ): Promise<{ message: string }> {
    const result: Result<boolean, string> = await this.commandBus.execute(
      new DeleteProfileCommand(userId),
    );

    if (!result.success) {
      if (result.error === 'Profile not found') {
        throw new NotFoundException(result.error);
      }
      throw new HttpException(result.error, HttpStatus.BAD_REQUEST);
    }

    return { message: 'Profile deleted successfully' };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Mettre à jour un profil par son ID (admin uniquement)' })
  @ApiCookieAuth('sAccessToken')
  @ApiParam({
    name: 'id',
    description: 'ID du profil à mettre à jour',
    example: '43a39f90-1718-470d-bcef-c7ebeb972c0d',
  })
  @ApiBody({
    description: 'Données de mise à jour du profil',
    type: UpdateProfileRequestDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Profil mis à jour avec succès',
  })
  @ApiResponse({
    status: 403,
    description: 'Accès interdit',
    example: {
      message: 'You are not allowed to update this profile',
      statusCode: 403,
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Profil non trouvé',
    example: {
      message: 'Profile not found',
      statusCode: 404,
    },
  })
  async updateProfile(
    @Session('userId') currentUserId: string,
    @Param('id') profileId: string,
    @Body() updateProfileDto: UpdateProfileRequestDto,
  ): Promise<ProfileResponseDto> {
    // Vérifier que l'utilisateur met à jour son propre profil
    if (currentUserId !== profileId) {
      throw new ForbiddenException('You are not allowed to update this profile');
    }

    const result: Result<Profile, string> = await this.commandBus.execute(
      new UpdateProfileCommand(profileId, updateProfileDto),
    );

    if (!result.success) {
      if (result.error === 'Profile not found') {
        throw new NotFoundException(result.error);
      }
      throw new HttpException(result.error, HttpStatus.BAD_REQUEST);
    }

    return UpdateProfileResponseDto.toResponse(result.value);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer un profil par son ID (admin uniquement)' })
  @ApiCookieAuth('sAccessToken')
  @ApiParam({
    name: 'id',
    description: 'ID du profil à supprimer',
    example: '43a39f90-1718-470d-bcef-c7ebeb972c0d',
  })
  @ApiResponse({
    status: 200,
    description: 'Profil supprimé avec succès',
    example: {
      message: 'Profile deleted successfully',
    },
  })
  @ApiResponse({
    status: 403,
    description: 'Accès interdit',
    example: {
      message: 'You are not allowed to delete this profile',
      statusCode: 403,
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Profil non trouvé',
    example: {
      message: 'Profile not found',
      statusCode: 404,
    },
  })
  async deleteProfile(
    @Session('userId') currentUserId: string,
    @Param('id') profileId: string,
  ): Promise<{ message: string }> {
    // Vérifier que l'utilisateur supprime son propre profil
    if (currentUserId !== profileId) {
      throw new ForbiddenException('You are not allowed to delete this profile');
    }

    const result: Result<boolean, string> = await this.commandBus.execute(
      new DeleteProfileCommand(profileId),
    );

    if (!result.success) {
      if (result.error === 'Profile not found') {
        throw new NotFoundException(result.error);
      }
      throw new HttpException(result.error, HttpStatus.BAD_REQUEST);
    }

    return { message: 'Profile deleted successfully' };
  }
}
