import { getProfileService } from '@/features/profile/services/profile.holder';
import { getUserService } from '@/features/user/services/user.holder';
import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { Account } from 'better-auth/types';
import * as process from 'node:process';
import { PrismaService } from 'prisma/prisma.service';

const prisma = new PrismaService();

export const auth: {
  handler: (req: Request) => Promise<Response>;
} = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  emailAndPassword: {
    enabled: true,
  },
  user: {
    additionalFields: {
      bio: { type: 'string', required: false, input: false },
      login: { type: 'string', required: true, input: true },
      location: { type: 'string', required: false, input: false },
      company: { type: 'string', required: false, input: false },
    },
  },
  logger: {
    level: 'debug',
    transport: {
      type: 'console',
      options: {
        colorize: true,
        timestamp: true,
      },
    },
  },
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
      redirectURL: `${process.env.BACKEND_URL}/api/auth/callback/github`,
      overrideUserInfoOnSignIn: false,
      scope: ['read:user', 'user:email', 'repo', 'read:org'],
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      redirectURL: `${process.env.BACKEND_URL}/api/auth/callback/google`,
    },
  },
  trustedOrigins: [
    process.env.FRONTEND_URL as string,
    process.env.BACKEND_URL as string,
  ],
  baseURL: process.env.BACKEND_URL,
  urls: {
    signInRedirect: `${process.env.FRONTEND_URL}/`,
    signOutRedirect: `${process.env.FRONTEND_URL}/`,
  },
  databaseHooks: {
    account: {
      create: {
        after: async (account: Account): Promise<void> => {
          if (account.providerId === 'github') {
            await getUserService().updateGithubLogin(account);
            await getProfileService().createFromGithub(account);
          } else {
            await getProfileService().upsertProfile(account.userId, {
              username: '',
              avatarUrl: '',
              jobTitle: '',
              bio: '',
              techStacks: [],
              socialLinks: {},
            });
          }
          return;
        },
      },
    },
  },
  advanced: {
    crossSubDomainCookies: {
      enabled: false,
      cookieName: 'better-auth',
      cookieDomain:
        process.env.NODE_ENV === 'production'
          ? process.env.COOKIE_DOMAIN
          : 'localhost',
    },
  },
});
