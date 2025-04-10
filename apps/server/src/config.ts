import EmailPassword from 'supertokens-node/recipe/emailpassword';
import Session from 'supertokens-node/recipe/session';
import Dashboard from 'supertokens-node/recipe/dashboard';

export const appInfo = {
  // Learn more about this on https://supertokens.com/docs/emailpassword/appinfo
  appName: process.env.APP_NAME,
  apiDomain: process.env.API_DOMAIN,
  websiteDomain: process.env.WEBSITE_DOMAIN,
  apiBasePath: '/auth',
  websiteBasePath: '/auth',
};

export const connectionUri = process.env.CONNECTION_URI;

export const recipeList = [
  EmailPassword.init(),
  Session.init(),
  Dashboard.init(),
];
