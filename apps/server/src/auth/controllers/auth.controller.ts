import { Controller, Post } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiBody,
} from '@nestjs/swagger';
import { IsEnum } from 'class-validator';

enum ProviderEnum {
  GITHUB = 'github',
  GOOGLE = 'google',
}

class SignInWithSocialRequestDto {
  @IsEnum(ProviderEnum)
  provider: ProviderEnum;
}

@ApiTags('Authentification')
@Controller('api/auth')
export class AuthController {
  constructor() {}

  @Post('sign-in/social')
  @ApiOperation({
    summary: 'Connexion/inscription avec GitHub ou Google',
    description:
      'Retourne l’URL OAuth à laquelle rediriger l’utilisateur. La logique est gérée par Better Auth.',
  })
  @ApiBody({
    type: SignInWithSocialRequestDto,
    examples: {
      github: { value: { provider: 'github' } },
      google: { value: { provider: 'google' } },
    },
  })
  @ApiOkResponse({
    description: "URL de redirection vers le fournisseur d'authentification",
    schema: {
      type: 'object',
      properties: {
        url: {
          type: 'string',
          example:
            'https://github.com/login/oauth/authorize?response_type=code&client_id=Ov23liAbmidu21MMZejU&state=WMidfozBNHMYZGh8h0eD9Wt2yq7m-H3A&scope=read%3Auser+user%3Aemail&redirect_uri=http%3A%2F%2Flocalhost%3A4000%2Fapi%2Fauth%2Fcallback%2Fgithub',
        },
        redirect: { type: 'boolean', example: true },
      },
      required: ['url', 'redirect'],
      example: {
        url: 'https://github.com/login/oauth/authorize?response_type=code&client_id=Ov23liAbmidu21MMZejU&state=WMidfozBNHMYZGh8h0eD9Wt2yq7m-H3A&scope=read%3Auser+user%3Aemail&redirect_uri=http%3A%2F%2Flocalhost%3A4000%2Fapi%2Fauth%2Fcallback%2Fgithub',
        redirect: true,
      },
    },
  })
  @ApiBadRequestResponse({ description: 'Provider manquant ou invalide' })
  signInWithSocial() {
    // ⚠️ La vraie logique est gérée par Better Auth (route/handler interne).
  }

}
