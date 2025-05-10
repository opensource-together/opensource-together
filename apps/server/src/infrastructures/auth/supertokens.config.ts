import Session from 'supertokens-node/recipe/session';
import { SuperTokensModuleOptions } from 'supertokens-nestjs/dist/supertokens.types';
import { emailPasswordRecipe } from '@infrastructures/auth/recipes/email-password.recipe';
import EmailVerification from 'supertokens-node/recipe/emailverification';

// export function createSupertokensConfig(): SuperTokensModuleOptions {
// return {
export const supertokensConfig: SuperTokensModuleOptions = {
  framework: 'express',
  supertokens: {
    connectionURI: process.env.CONNECTION_URI as string,
    apiKey: process.env.SUPERTOKENS_API_KEY as string,
  },
  appInfo: {
    appName: process.env.APP_NAME as string,
    apiDomain: process.env.API_DOMAIN as string,
    websiteDomain: process.env.WEBSITE_DOMAIN as string,
  },
  recipeList: [
    emailPasswordRecipe(),
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
// }
