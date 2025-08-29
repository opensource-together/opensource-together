import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import * as process from 'node:process';
import { PrismaService } from 'prisma/prisma.service';
import { getProfileService } from '@/features/profile/services/profile.holder';
import { Account } from 'better-auth/types';

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
      login: { type: 'string', required: false, input: false },
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
      redirectURL: 'http://localhost:4000/api/auth/callback/github',
      overrideUserInfoOnSignIn: true,
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      redirectURL: 'http://localhost:4000/api/auth/callback/google',
    },
  },
  trustedOrigins: ['http://localhost:3000', 'http://localhost:4000'],
  baseURL: 'http://localhost:4000',
  databaseHooks: {
    account: {
      create: {
        after: async (account: Account): Promise<void> => {
          if (account.providerId === 'github') {
            await getProfileService().createFromGithub(account);
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
      cookieDomain: 'localhost',
    },
  },
});
