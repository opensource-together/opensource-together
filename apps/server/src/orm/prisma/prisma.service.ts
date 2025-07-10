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
    // Seed TechStacks
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
      console.log('Base de données initialisée avec les technologies');
    }

    // Seed Categories
    const categoryCount = await this.category.count();
    if (categoryCount === 0) {
      const categories = [
        {
          id: '1',
          name: 'IA & Machine Learning',
        },
        {
          id: '2',
          name: 'Développement Web',
        },
        {
          id: '3',
          name: 'Applications Mobile',
        },
        {
          id: '4',
          name: 'DevOps & Cloud',
        },
        {
          id: '5',
          name: 'Jeux Vidéo',
        },
        {
          id: '6',
          name: 'Blockchain & Crypto',
        },
        {
          id: '7',
          name: 'E-commerce',
        },
        {
          id: '8',
          name: 'Fintech',
        },
        {
          id: '9',
          name: 'Santé & Médecine',
        },
        {
          id: '10',
          name: 'Éducation',
        },
        {
          id: '11',
          name: 'Réseaux Sociaux',
        },
        {
          id: '12',
          name: 'Productivité',
        },
        {
          id: '13',
          name: 'Sécurité & Cybersécurité',
        },
        {
          id: '14',
          name: 'IoT & Hardware',
        },
        {
          id: '15',
          name: 'Data Science & Analytics',
        },
        {
          id: '16',
          name: 'Outils Développeur',
        },
        {
          id: '17',
          name: 'API & Microservices',
        },
        {
          id: '18',
          name: 'Open Source Tools',
        },
      ];

      for (const category of categories) {
        await this.category.create({ data: category });
      }
      console.log('Base de données initialisée avec les catégories');
    }
  }

  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
  }
}
