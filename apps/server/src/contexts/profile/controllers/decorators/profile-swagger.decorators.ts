import { applyDecorators } from '@nestjs/common';
import {
  ApiBody,
  ApiCookieAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';
import { UpdateProfileRequestDto } from '../dtos/update-profile-request.dto';

export function GetMyProfileSwagger() {
  return applyDecorators(
    ApiOperation({ summary: "Récupérer le profil de l'utilisateur courant" }),
    ApiCookieAuth('sAccessToken'),
    ApiResponse({
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
        techStacks: [],
        experiences: [],
        joinedAt: '2025-04-16T15:47:31.633Z',
        profileUpdatedAt: '2025-04-16T15:47:31.633Z',
      },
    }),
    ApiResponse({
      status: 404,
      description: 'Utilisateur non trouvé',
      example: {
        message: 'Utilisateur non trouvé.',
        error: 'Not Found',
        statusCode: 404,
      },
    }),
  );
}

export function GetProjectsByProfileIdSwagger() {
  return applyDecorators(
    ApiOperation({ summary: "Récupérer tous les projets d'un profil" }),
    ApiParam({
      name: 'profileId',
      description: 'ID du profil dont on veut récupérer les projets',
      example: '43a39f90-1718-470d-bcef-c7ebeb972c0d',
    }),
    ApiResponse({
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
    }),
    ApiResponse({
      status: 400,
      description: 'Erreur lors de la récupération des projets',
      example: {
        message: 'Error retrieving projects for profile',
        statusCode: 400,
      },
    }),
    ApiResponse({
      status: 404,
      description: 'Profil non trouvé',
      example: {
        message: 'Profile not found',
        statusCode: 404,
      },
    }),
  );
}

export function GetProfileByIdSwagger() {
  return applyDecorators(
    ApiOperation({ summary: 'Récupérer un profil par son ID' }),
    ApiParam({
      name: 'id',
      description: "ID de l'utilisateur dont on veut récupérer le profil",
      example: '43a39f90-1718-470d-bcef-c7ebeb972c0d',
    }),
    ApiResponse({
      status: 200,
      description: 'Profil utilisateur retourné avec succès',
      example: {
        id: '43a39f90-1718-470d-bcef-c7ebeb972c0d',
        name: 'John Doe',
        avatarUrl: 'https://avatars.githubusercontent.com/u/45101981?v=4',
        bio: 'Fullstack Developer | \r\nExpress & React | \r\nBuilding awesome-project ',
        location: 'Paris, France',
        company: 'Tech Corp',
        socialLinks: [
          { type: 'github', url: 'https://github.com/johndoe' },
          { type: 'twitter', url: 'https://twitter.com/johndoe' },
          { type: 'linkedin', url: 'https://www.linkedin.com/in/johndoe/' },
          { type: 'website', url: 'https://johndoe.com' },
        ],
        techStacks: [],
        experiences: [],
        projects: [],
        joinedAt: '2025-04-16T15:47:31.633Z',
        profileUpdatedAt: '2025-04-16T15:47:31.633Z',
      },
    }),
    ApiResponse({
      status: 404,
      description: 'Profil non trouvé',
      example: {
        message: 'Profile not found',
        error: 'Not Found',
        statusCode: 404,
      },
    }),
  );
}

export function UpdateProfileSwagger() {
  return applyDecorators(
    ApiOperation({
      summary: 'Mettre à jour un profil par son ID (utilisateur courant)',
    }),
    ApiCookieAuth('sAccessToken'),
    ApiBody({
      description: 'Données de mise à jour du profil',
      type: UpdateProfileRequestDto,
    }),
    ApiResponse({
      status: 200,
      description: 'Profil mis à jour avec succès',
    }),
    ApiResponse({
      status: 403,
      description: 'Accès interdit',
      example: {
        message: 'You are not allowed to update this profile',
        statusCode: 403,
      },
    }),
    ApiResponse({
      status: 404,
      description: 'Profil non trouvé',
      example: {
        message: 'Profile not found',
        statusCode: 404,
      },
    }),
  );
}

export function DeleteMyProfileSwagger() {
  return applyDecorators(
    ApiOperation({ summary: "Supprimer le profil de l'utilisateur courant" }),
    ApiCookieAuth('sAccessToken'),
    ApiResponse({
      status: 200,
      description: 'Profil supprimé avec succès',
      example: {
        message: 'Profile deleted successfully',
      },
    }),
    ApiResponse({
      status: 404,
      description: 'Profil non trouvé',
      example: {
        message: 'Profile not found',
        statusCode: 404,
      },
    }),
  );
}

export function DeleteProfileSwagger() {
  return applyDecorators(
    ApiOperation({
      summary: 'Supprimer un profil par son ID (admin uniquement)',
    }),
    ApiCookieAuth('sAccessToken'),
    ApiParam({
      name: 'id',
      description: 'ID du profil à supprimer',
      example: '43a39f90-1718-470d-bcef-c7ebeb972c0d',
    }),
    ApiResponse({
      status: 200,
      description: 'Profil supprimé avec succès',
      example: {
        message: 'Profile deleted successfully',
      },
    }),
    ApiResponse({
      status: 403,
      description: 'Accès interdit',
      example: {
        message: 'You are not allowed to delete this profile',
        statusCode: 403,
      },
    }),
    ApiResponse({
      status: 404,
      description: 'Profil non trouvé',
      example: {
        message: 'Profile not found',
        statusCode: 404,
      },
    }),
  );
}
