import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
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
          iconUrl:
            'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg',
        },
        {
          id: '2',
          name: 'Next.js',
          iconUrl:
            'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nextjs/nextjs-original.svg',
        },
        {
          id: '3',
          name: 'Angular',
          iconUrl:
            'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/angularjs/angularjs-original.svg',
        },
        {
          id: '4',
          name: 'Vue.js',
          iconUrl:
            'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vuejs/vuejs-original.svg',
        },
        {
          id: '5',
          name: 'Node.js',
          iconUrl:
            'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg',
        },
        {
          id: '6',
          name: 'Express',
          iconUrl:
            'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/express/express-original.svg',
        },
        {
          id: '7',
          name: 'Nest.js',
          iconUrl:
            'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nestjs/nestjs-original.svg',
        },
        {
          id: '8',
          name: 'Fastify',
          iconUrl:
            'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/fastify/fastify-original.svg',
        },
        {
          id: '9',
          name: 'TypeScript',
          iconUrl:
            'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg',
        },
        {
          id: '10',
          name: 'Go',
          iconUrl:
            'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/go/go-original-wordmark.svg',
        },
        {
          id: '11',
          name: 'MongoDB',
          iconUrl:
            'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mongodb/mongodb-original.svg',
        },
        {
          id: '12',
          name: 'PostgreSQL',
          iconUrl:
            'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postgresql/postgresql-original.svg',
        },
        {
          id: '13',
          name: 'MySQL',
          iconUrl:
            'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mysql/mysql-original.svg',
        },
        {
          id: '14',
          name: 'Redis',
          iconUrl:
            'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/redis/redis-original.svg',
        },
        {
          id: '15',
          name: 'Tailwind CSS',
          iconUrl:
            'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg',
        },
        {
          id: '16',
          name: 'Docker',
          iconUrl:
            'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/docker/docker-plain.svg',
        },
        {
          id: '17',
          name: 'Kubernetes',
          iconUrl:
            'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/kubernetes/kubernetes-original.svg',
        },
        {
          id: '18',
          name: 'AWS',
          iconUrl:
            'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/amazonwebservices/amazonwebservices-original-wordmark.svg',
        },
        {
          id: '19',
          name: 'GCP',
          iconUrl:
            'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/googlecloud/googlecloud-original.svg',
        },
        {
          id: '20',
          name: 'Azure',
          iconUrl:
            'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/microsoftazure/microsoftazure-original.svg',
        },
        {
          id: '21',
          name: 'npm',
          iconUrl:
            'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/npm/npm-original-wordmark.svg',
        },
        {
          id: '22',
          name: 'Slack',
          iconUrl:
            'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/slack/slack-original.svg',
        },
        {
          id: '23',
          name: 'Discord API',
          iconUrl:
            'https://upload.wikimedia.org/wikipedia/fr/thumb/4/4f/Discord_Logo_sans_texte.svg/1818px-Discord_Logo_sans_texte.svg.png',
        },
        {
          id: '24',
          name: 'Markdown',
          iconUrl:
            'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/markdown/markdown-original.svg',
        },
        {
          id: '25',
          name: 'Figma',
          iconUrl:
            'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/figma/figma-original.svg',
        },
        {
          id: '26',
          name: 'Python',
          iconUrl:
            'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg',
        },
        {
          id: '27',
          name: 'Java',
          iconUrl:
            'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/java/java-original.svg',
        },
        {
          id: '28',
          name: 'C#',
          iconUrl:
            'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/csharp/csharp-original.svg',
        },
        {
          id: '29',
          name: 'PHP',
          iconUrl:
            'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/php/php-original.svg',
        },
        {
          id: '30',
          name: 'Ruby',
          iconUrl:
            'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/ruby/ruby-original.svg',
        },
        {
          id: '31',
          name: 'Rust',
          iconUrl:
            'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/rust/rust-original.svg',
        },
        {
          id: '32',
          name: 'Flutter',
          iconUrl:
            'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/flutter/flutter-original.svg',
        },
        {
          id: '33',
          name: 'Svelte',
          iconUrl:
            'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/svelte/svelte-original.svg',
        },
        {
          id: '34',
          name: 'Prisma',
          iconUrl: 'https://www.prisma.io/favicon.ico',
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
