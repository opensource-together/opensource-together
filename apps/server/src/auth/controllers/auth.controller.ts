import { Controller, Post, Get } from '@nestjs/common';
import { PublicAccess } from 'supertokens-nestjs';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiCookieAuth,
} from '@nestjs/swagger';

/**
 * Contrôleur Auth pour la documentation Swagger des routes SuperTokens
 *
 * Ce contrôleur sert uniquement à documenter les routes d'authentification
 * gérées par SuperTokens. Les routes réelles sont automatiquement créées
 * par SuperTokens et configurées dans supertokens.config.ts
 */
@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor() {}

  // Les méthodes suivantes sont des "proxy" pour la documentation Swagger
  // Les vraies routes sont gérées par SuperTokens automatiquement

  /**
   * Route de documentation pour POST /auth/signup
   * Route réelle gérée par SuperTokens EmailPassword recipe
   */
  @PublicAccess()
  @Post('signup')
  @ApiOperation({
    summary: 'Inscription utilisateur avec email et mot de passe',
  })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['formFields'],
      properties: {
        formFields: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string', example: 'email' },
              value: { type: 'string', example: 'user@example.com' },
            },
          },
          example: [
            { id: 'email', value: 'user@example.com' },
            { id: 'password', value: 'motdepasse123' },
          ],
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Utilisateur créé avec succès',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'OK' },
        user: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 'user123' },
            email: { type: 'string', example: 'user@example.com' },
            timeJoined: { type: 'number', example: 1640995200000 },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Erreur de validation',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'FIELD_ERROR' },
        formFields: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string', example: 'email' },
              error: { type: 'string', example: 'Email déjà utilisé' },
            },
          },
        },
      },
    },
  })
  async signup() {
    // Cette méthode ne sera jamais appelée - documentation uniquement
    throw new Error('Cette route est gérée par SuperTokens');
  }

  /**
   * Route de documentation pour POST /auth/signin
   * Route réelle gérée par SuperTokens EmailPassword recipe
   */
  @PublicAccess()
  @Post('signin')
  @ApiOperation({ summary: 'Connexion utilisateur avec email et mot de passe' })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['formFields'],
      properties: {
        formFields: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string', example: 'email' },
              value: { type: 'string', example: 'user@example.com' },
            },
          },
          example: [
            { id: 'email', value: 'user@example.com' },
            { id: 'password', value: 'motdepasse123' },
          ],
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Connexion réussie',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'OK' },
        user: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 'user123' },
            email: { type: 'string', example: 'user@example.com' },
            timeJoined: { type: 'number', example: 1640995200000 },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Identifiants incorrects',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'WRONG_CREDENTIALS_ERROR' },
        message: { type: 'string', example: 'Email ou mot de passe incorrect' },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Erreur de validation',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'FIELD_ERROR' },
        formFields: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string', example: 'email' },
              error: { type: 'string', example: 'Email requis' },
            },
          },
        },
      },
    },
  })
  async signin() {
    // Cette méthode ne sera jamais appelée - documentation uniquement
    throw new Error('Cette route est gérée par SuperTokens');
  }

  /**
   * Route de documentation pour GET /auth/authorize/github
   * Route réelle gérée par SuperTokens ThirdParty recipe
   */
  @PublicAccess()
  @Get('authorize/github')
  @ApiOperation({
    summary: "Initier l'authentification GitHub OAuth",
    description:
      "Redirige l'utilisateur vers GitHub pour l'authentification OAuth. Cette route déclenche le flow OAuth et redirige vers GitHub.",
  })
  @ApiResponse({
    status: 302,
    description: 'Redirection vers GitHub pour authentification OAuth',
    headers: {
      Location: {
        description: 'URL de redirection vers GitHub OAuth',
        schema: {
          type: 'string',
          example:
            'https://github.com/login/oauth/authorize?client_id=xxx&redirect_uri=http://localhost:4000/auth/callback/github&scope=user:email&state=xxx',
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Erreur de configuration OAuth',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'GENERAL_ERROR' },
        message: {
          type: 'string',
          example: 'Configuration OAuth GitHub invalide',
        },
      },
    },
  })
  async authorizeGithub() {
    // Cette méthode ne sera jamais appelée - documentation uniquement
    throw new Error('Cette route est gérée par SuperTokens');
  }

  /**
   * Route de documentation pour GET /auth/callback/github
   * Route réelle gérée par SuperTokens ThirdParty recipe
   */
  @PublicAccess()
  @Get('callback/github')
  @ApiOperation({
    summary: 'Callback GitHub après authentification OAuth',
    description:
      "Traite la réponse de GitHub après authentification OAuth. Crée ou connecte l'utilisateur et redirige vers l'application.",
  })
  @ApiParam({
    name: 'code',
    description: "Code d'autorisation retourné par GitHub",
    required: true,
    type: 'string',
    example: 'abc123def456',
  })
  @ApiParam({
    name: 'state',
    description: 'Paramètre state pour la sécurité OAuth',
    required: true,
    type: 'string',
    example: 'xyz789',
  })
  @ApiResponse({
    status: 302,
    description:
      "Redirection vers l'application après authentification réussie",
    headers: {
      Location: {
        description: "URL de redirection vers l'application",
        schema: {
          type: 'string',
          example: 'http://localhost:3000/dashboard',
        },
      },
      'Set-Cookie': {
        description: 'Cookies de session SuperTokens',
        schema: {
          type: 'string',
          example:
            'sAccessToken=xxx; sRefreshToken=xxx; Path=/; HttpOnly; Secure',
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Erreur lors du traitement du callback',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'GENERAL_ERROR' },
        message: {
          type: 'string',
          example: "Code d'autorisation invalide ou expiré",
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Authentification GitHub échouée',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'SIGN_IN_UP_NOT_ALLOWED' },
        message: {
          type: 'string',
          example: 'Accès refusé par GitHub ou compte non autorisé',
        },
      },
    },
  })
  async callbackGithub() {
    // Cette méthode ne sera jamais appelée - documentation uniquement
    throw new Error('Cette route est gérée par SuperTokens');
  }

  /**
   * Route de documentation pour GET /auth/session
   * Route réelle gérée par SuperTokens Session recipe
   */
  @Get('session')
  @ApiCookieAuth('sAccessToken')
  @ApiOperation({
    summary: 'Récupérer les informations de session utilisateur',
    description:
      "Retourne les informations de la session active de l'utilisateur connecté (équivalent à /me)",
  })
  @ApiResponse({
    status: 200,
    description: 'Informations de session récupérées avec succès',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'OK' },
        sessionHandle: { type: 'string', example: 'session_abc123' },
        userId: { type: 'string', example: 'user123' },
        userDataInJWT: {
          type: 'object',
          properties: {
            email: { type: 'string', example: 'user@example.com' },
            sub: { type: 'string', example: 'user123' },
          },
        },
        accessTokenPayload: {
          type: 'object',
          properties: {
            sessionHandle: { type: 'string', example: 'session_abc123' },
            userId: { type: 'string', example: 'user123' },
            refreshTokenHash1: { type: 'string', example: 'hash123' },
            parentRefreshTokenHash1: {
              type: 'string',
              example: 'parentHash123',
            },
            antiCsrfToken: { type: 'string', example: 'csrf123' },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Session invalide ou expirée',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'UNAUTHORISED' },
        message: { type: 'string', example: 'Session expirée ou invalide' },
      },
    },
  })
  async getSession() {
    // Cette méthode ne sera jamais appelée - documentation uniquement
    throw new Error('Cette route est gérée par SuperTokens');
  }

  /**
   * Route de documentation pour POST /auth/signout
   * Route réelle gérée par SuperTokens Session recipe
   */
  @Post('signout')
  @ApiCookieAuth('sAccessToken')
  @ApiOperation({
    summary: "Déconnexion de l'utilisateur",
    description:
      'Invalide la session courante et supprime les cookies de session',
  })
  @ApiResponse({
    status: 200,
    description: 'Déconnexion réussie',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'OK' },
      },
    },
    headers: {
      'Set-Cookie': {
        description: 'Suppression des cookies de session',
        schema: {
          type: 'string',
          example:
            'sAccessToken=; sRefreshToken=; Path=/; HttpOnly; Secure; Max-Age=0',
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Session invalide',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'UNAUTHORISED' },
        message: {
          type: 'string',
          example: 'Aucune session active à déconnecter',
        },
      },
    },
  })
  async signout() {
    // Cette méthode ne sera jamais appelée - documentation uniquement
    throw new Error('Cette route est gérée par SuperTokens');
  }

  /**
   * Route de documentation pour POST /auth/session/refresh
   * Route réelle gérée par SuperTokens Session recipe
   */
  @Post('session/refresh')
  @ApiCookieAuth('sRefreshToken')
  @ApiOperation({
    summary: 'Renouveler la session utilisateur',
    description:
      'Utilise le refresh token pour générer un nouveau access token',
  })
  @ApiResponse({
    status: 200,
    description: 'Session renouvelée avec succès',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'OK' },
        session: {
          type: 'object',
          properties: {
            handle: { type: 'string', example: 'session_new123' },
            userId: { type: 'string', example: 'user123' },
            userDataInJWT: {
              type: 'object',
              properties: {
                email: { type: 'string', example: 'user@example.com' },
              },
            },
          },
        },
      },
    },
    headers: {
      'Set-Cookie': {
        description: 'Nouveaux cookies de session',
        schema: {
          type: 'string',
          example:
            'sAccessToken=newToken; sRefreshToken=newRefresh; Path=/; HttpOnly; Secure',
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Refresh token invalide ou expiré',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'UNAUTHORISED' },
        message: {
          type: 'string',
          example: 'Refresh token invalide ou expiré',
        },
      },
    },
  })
  async refreshSession() {
    // Cette méthode ne sera jamais appelée - documentation uniquement
    throw new Error('Cette route est gérée par SuperTokens');
  }

  /**
   * Route de documentation pour GET /auth/session/verify
   * Route réelle gérée par SuperTokens Session recipe
   */
  @Get('session/verify')
  @ApiCookieAuth('sAccessToken')
  @ApiOperation({
    summary: 'Vérifier la validité de la session',
    description:
      'Vérifie si la session courante est valide sans retourner les données',
  })
  @ApiResponse({
    status: 200,
    description: 'Session valide',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'OK' },
        valid: { type: 'boolean', example: true },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Session invalide',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'UNAUTHORISED' },
        valid: { type: 'boolean', example: false },
        message: { type: 'string', example: 'Session invalide ou expirée' },
      },
    },
  })
  async verifySession() {
    // Cette méthode ne sera jamais appelée - documentation uniquement
    throw new Error('Cette route est gérée par SuperTokens');
  }

  /**
   * Route de documentation pour POST /auth/user/password/reset
   * Route réelle gérée par SuperTokens EmailPassword recipe
   */
  @PublicAccess()
  @Post('user/password/reset')
  @ApiOperation({
    summary: 'Demander une réinitialisation de mot de passe',
    description:
      "Envoie un email avec un lien de réinitialisation de mot de passe à l'utilisateur",
  })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['formFields'],
      properties: {
        formFields: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string', example: 'email' },
              value: { type: 'string', example: 'user@example.com' },
            },
          },
          example: [{ id: 'email', value: 'user@example.com' }],
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Email de réinitialisation envoyé avec succès',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'OK' },
        message: {
          type: 'string',
          example: 'Email de réinitialisation envoyé si le compte existe',
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Erreur de validation',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'FIELD_ERROR' },
        formFields: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string', example: 'email' },
              error: { type: 'string', example: "Format d'email invalide" },
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 429,
    description: 'Trop de tentatives de réinitialisation',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'PASSWORD_RESET_NOT_ALLOWED' },
        message: {
          type: 'string',
          example: 'Trop de tentatives, veuillez réessayer plus tard',
        },
      },
    },
  })
  async resetPassword() {
    // Cette méthode ne sera jamais appelée - documentation uniquement
    throw new Error('Cette route est gérée par SuperTokens');
  }

  /**
   * Route de documentation pour POST /auth/user/password/reset/token
   * Route réelle gérée par SuperTokens EmailPassword recipe
   */
  @PublicAccess()
  @Post('user/password/reset/token')
  @ApiOperation({
    summary: 'Confirmer la réinitialisation de mot de passe',
    description:
      'Utilise le token reçu par email pour définir un nouveau mot de passe',
  })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['formFields', 'token'],
      properties: {
        formFields: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string', example: 'password' },
              value: { type: 'string', example: 'nouveauMotDePasse123' },
            },
          },
          example: [{ id: 'password', value: 'nouveauMotDePasse123' }],
        },
        token: {
          type: 'string',
          example: 'reset_token_abc123def456',
          description: 'Token de réinitialisation reçu par email',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Mot de passe réinitialisé avec succès',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'OK' },
        user: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 'user123' },
            email: { type: 'string', example: 'user@example.com' },
            timeJoined: { type: 'number', example: 1640995200000 },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Token invalide ou erreur de validation',
    schema: {
      type: 'object',
      properties: {
        status: {
          type: 'string',
          example: 'RESET_PASSWORD_INVALID_TOKEN_ERROR',
        },
        message: {
          type: 'string',
          example: 'Token de réinitialisation invalide ou expiré',
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Erreur de validation du mot de passe',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'FIELD_ERROR' },
        formFields: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string', example: 'password' },
              error: {
                type: 'string',
                example: 'Le mot de passe doit contenir au moins 8 caractères',
              },
            },
          },
        },
      },
    },
  })
  async resetPasswordToken() {
    // Cette méthode ne sera jamais appelée - documentation uniquement
    throw new Error('Cette route est gérée par SuperTokens');
  }
}
