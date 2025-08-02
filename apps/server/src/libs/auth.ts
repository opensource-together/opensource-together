import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { PrismaService } from '@/persistence/orm/prisma/services/prisma.service';

// Utiliser votre PrismaService existant qui pointe vers le bon schéma
const prismaService = new PrismaService();

export const auth: any = betterAuth({
  database: prismaAdapter(prismaService, {
    provider: 'postgresql',
  }),
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
      redirectURL: 'http://localhost:4000/api/auth/callback/github',
      userInfoMap: {
        username: 'login',
        name: 'name',
        email: 'email',
        image: 'avatar_url',
        bio: 'bio',
        location: 'location',
        company: 'company',
      },
    },
  },
  baseURL: 'http://localhost:4000',
  secret: process.env.BETTER_AUTH_SECRET as string,
  trustedOrigins: ['http://localhost:3000'],
});
