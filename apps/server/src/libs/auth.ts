import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const auth: any = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
      redirectURL: 'http://localhost:4000/api/auth/callback/github',
    },
  },
  baseURL: 'http://localhost:4000',
  secret: process.env.BETTER_AUTH_SECRET as string,
  trustedOrigins: ['http://localhost:3000'],
});
