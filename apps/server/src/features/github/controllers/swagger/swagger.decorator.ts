import { applyDecorators } from '@nestjs/common';
import {
    ApiCookieAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

export function GetGithubRepositorySwagger() {
  return applyDecorators(
    ApiOperation({
      summary:
      "Récupérer la liste des repository github de l'utilisateur courant",
    }),
    ApiCookieAuth('sAccessToken'),
    ApiResponse({
      status: 200,
      description: 'List repository utilisateur retournée avec succès',
      example: {
        repositories: [
          {
            owner: 'JohnDoe',
            title: 'SampleProject',
            description: "Un projet d'example",
            url: 'https://github.com/JohnDoe/SampleProject',
          },
        ],
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

