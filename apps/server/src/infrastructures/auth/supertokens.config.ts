import Session from 'supertokens-node/recipe/session';
import { SuperTokensModuleOptions } from 'supertokens-nestjs/dist/supertokens.types';
import { emailPasswordRecipe } from '@infrastructures/auth/recipes/email-password.recipe';
import EmailVerification from 'supertokens-node/recipe/emailverification';
import { CommandBus, QueryBus } from '@nestjs/cqrs';

export function createSupertokensConfig({
  commandBus,
  queryBus,
}: {
  commandBus: CommandBus;
  queryBus: QueryBus;
}): SuperTokensModuleOptions {
  return {
    framework: 'express',
    supertokens: {
      connectionURI: process.env.CONNECTION_URI as string,
    },
    appInfo: {
      appName: 'OpenSource Together',
      apiDomain: process.env.API_DOMAIN as string,
      websiteDomain: process.env.WEBSITE_DOMAIN as string,
      apiBasePath: '/auth',
      websiteBasePath: '/auth',
    },
    recipeList: [
      emailPasswordRecipe({
        commandBus,
        queryBus,
      }),
      EmailVerification.init({
        mode: 'OPTIONAL',
      }),
      Session.init({
        getTokenTransferMethod: () => {
          return 'cookie';
        },
        cookieSecure: process.env.NODE_ENV === 'production',
        cookieSameSite: 'lax',
        sessionExpiredStatusCode: 401,
        cookieDomain: process.env.COOKIE_DOMAIN,
      }),
    ],
  };
}
