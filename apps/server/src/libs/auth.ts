import { PrismaClient } from '@prisma/client';
import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import * as process from 'node:process';
// import { PrismaService } from '@/persistence/orm/prisma/services/prisma.service';

// const prisma: PrismaService = new PrismaService();
const prisma = new PrismaClient();

export const auth: any = betterAuth({
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
      clientId: 'Ov23liAbmidu21MMZejU',
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
      redirectURL: 'http://localhost:4000/api/auth/callback/github',
      overrideUserInfoOnSignIn: true,
      mapProfileToUser: (profile: any) => {
        console.log('profile', profile);
        return {
          bio: profile.bio,
          login: profile.login,
          location: profile.location,
          company: profile.company,
        };
      },
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      redirectURL: 'http://localhost:4000/api/auth/callback/google',
    },
  },
  trustedOrigins: ['http://localhost:4000', 'http://localhost:3000'],
  baseURL: 'http://localhost:4000',
  advanced: {
    crossSubDomainCookies: {
      enabled: true,
      cookieName: 'better-auth',
      cookieDomain: 'localhost',
    },
  },
});

console.log('✅ Better Auth initialized');
console.log('🔍 Routes exposées :', Object.keys(auth?.api || {}));
console.log('🔍 Routes exposées :', Object.keys(auth?.api.options || {}));
console.log(
  '🔍 Providers configurés :',
  Object.keys(auth?.options?.socialProviders || {}),
);
