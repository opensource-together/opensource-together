import { emailPasswordRecipe } from '@/auth/recipes/email-password.recipe';
import { thirdPartyRecipe } from '@/auth/recipes/third-party.recipe';
import { ConfigService } from '@nestjs/config';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { SuperTokensModuleOptions } from 'supertokens-nestjs/dist/supertokens.types';
import EmailVerification from 'supertokens-node/recipe/emailverification';
import Session from 'supertokens-node/recipe/session';

export function createSupertokensConfig(
  queryBus: QueryBus,
  commandBus: CommandBus,
  configService: ConfigService,
): SuperTokensModuleOptions {
  return {
    framework: 'express',
    supertokens: {
      connectionURI: configService.get('CONNECTION_URI') as string,
      apiKey: configService.get('SUPERTOKENS_API_KEY') as string,
    },
    appInfo: {
      appName: configService.get('APP_NAME') as string,
      apiDomain: configService.get('API_DOMAIN') as string,
      websiteDomain: configService.get('WEBSITE_DOMAIN') as string,
      apiBasePath: '/v1/auth',
      websiteBasePath: '/v1/auth',
    },
    recipeList: [
      emailPasswordRecipe(queryBus, commandBus),
      EmailVerification.init({
        mode: 'OPTIONAL',
      }),
      thirdPartyRecipe({ configService, commandBus }),
      Session.init({
        getTokenTransferMethod: () => {
          return 'cookie';
        },
        cookieSecure: configService.get('NODE_ENV') === 'production',
        cookieSameSite: 'lax',
        sessionExpiredStatusCode: 401,
        cookieDomain: configService.get('COOKIE_DOMAIN'),
      }),
    ],
  };
}
