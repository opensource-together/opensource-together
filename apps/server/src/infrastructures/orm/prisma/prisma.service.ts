import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  async onModuleInit(): Promise<void> {
    await this.$connect();

    await this.seedInitialData();
  }

  async seedInitialData() {
    const techStackCount = await this.techStack.count();

    if (techStackCount === 0) {
      const techStacks = [
        {
          id: '1',
          name: 'React',
          iconUrl: 'https://react.dev/logo-og.png',
        },
        {
          id: '2',
          name: 'Next.js',
          iconUrl: 'https://nextjs.org/static/favicon/favicon-32x32.png',
        },
        {
          id: '3',
          name: 'TypeScript',
          iconUrl: 'https://www.typescriptlang.org/static/images/logo.svg',
        },
        {
          id: '4',
          name: 'Tailwind CSS',
          iconUrl: 'https://tailwindcss.com/favicon.ico',
        },
        {
          id: '5',
          name: 'Prisma',
          iconUrl: 'https://www.prisma.io/favicon.ico',
        },
        {
          id: '6',
          name: 'PostgreSQL',
          iconUrl: 'https://www.postgresql.org/favicon.ico',
        },
        {
          id: '7',
          name: 'Docker',
          iconUrl: 'https://www.docker.com/favicon.ico',
        },
      ];

      for (const techStack of techStacks) {
        await this.techStack.create({ data: techStack });
      }
    }

    console.log('Base de données initialisée avec les technologies');
  }

  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
  }
}
