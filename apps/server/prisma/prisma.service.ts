import {
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
  Logger,
} from '@nestjs/common';
import { PrismaClient, TechStackType } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly Logger = new Logger(PrismaService.name);
  async onModuleInit(): Promise<void> {
    await this.$connect();
    this.Logger.log('Initializing database...');
    await this.seedInitialData();
  }
  async seedInitialData() {
    // Seed TechStacks
    const techStackCount = await this.techStack.count();
    if (techStackCount === 0) {
      const techStacks = [
        // --- Frameworks & Libraries ---
        {
          id: '1',
          name: 'React',
          iconUrl:
            'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg',
          type: TechStackType.TECH,
        },
        {
          id: '2',
          name: 'Next.js',
          iconUrl:
            'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nextjs/nextjs-original.svg',
          type: TechStackType.TECH,
        },
        {
          id: '3',
          name: 'Angular',
          iconUrl:
            'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/angularjs/angularjs-original.svg',
          type: TechStackType.TECH,
        },
        {
          id: '4',
          name: 'Vue.js',
          iconUrl:
            'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vuejs/vuejs-original.svg',
          type: TechStackType.TECH,
        },
        {
          id: '5',
          name: 'Node.js',
          iconUrl:
            'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg',
          type: TechStackType.TECH,
        },
        {
          id: '6',
          name: 'Express',
          iconUrl:
            'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/express/express-original.svg',
          type: TechStackType.TECH,
        },
        {
          id: '7',
          name: 'Nest.js',
          iconUrl:
            'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nestjs/nestjs-original.svg',
          type: TechStackType.TECH,
        },
        {
          id: '8',
          name: 'Fastify',
          iconUrl:
            'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/fastify/fastify-original.svg',
          type: TechStackType.TECH,
        },
        {
          id: '32',
          name: 'Flutter',
          iconUrl:
            'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/flutter/flutter-original.svg',
          type: TechStackType.TECH,
        },
        {
          id: '33',
          name: 'Svelte',
          iconUrl:
            'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/svelte/svelte-original.svg',
          type: TechStackType.TECH,
        },
        {
          id: '34',
          name: 'Prisma',
          iconUrl:
            'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/prisma/prisma-original.svg',
          type: TechStackType.TECH,
        },
        {
          id: '35',
          name: 'Django',
          iconUrl:
            'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/django/django-plain.svg',
          type: TechStackType.TECH,
        },
        {
          id: '36',
          name: 'Flask',
          iconUrl:
            'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/flask/flask-original.svg',
          type: TechStackType.TECH,
        },
        {
          id: '37',
          name: 'Spring Boot',
          iconUrl:
            'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/spring/spring-original.svg',
          type: TechStackType.TECH,
        },
        {
          id: '38',
          name: 'Laravel',
          iconUrl:
            'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/laravel/laravel-original.svg',
          type: TechStackType.TECH,
        },
        {
          id: '39',
          name: 'Symfony',
          iconUrl:
            'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/symfony/symfony-original.svg',
          type: TechStackType.TECH,
        },
        {
          id: '40',
          name: 'Rails',
          iconUrl:
            'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/rails/rails-plain.svg',
          type: TechStackType.TECH,
        },
        {
          id: '41',
          name: 'ASP.NET',
          iconUrl:
            'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/dot-net/dot-net-original.svg',
          type: TechStackType.TECH,
        },
        {
          id: '42',
          name: 'Qt',
          iconUrl:
            'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/qt/qt-original.svg',
          type: TechStackType.TECH,
        },
        // --- Languages ---
        {
          id: '9',
          name: 'TypeScript',
          iconUrl:
            'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg',
          type: TechStackType.LANGUAGE,
        },
        {
          id: '10',
          name: 'Go',
          iconUrl:
            'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/go/go-original-wordmark.svg',
          type: TechStackType.LANGUAGE,
        },
        {
          id: '26',
          name: 'Python',
          iconUrl:
            'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg',
          type: TechStackType.LANGUAGE,
        },
        {
          id: '27',
          name: 'Java',
          iconUrl:
            'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/java/java-original.svg',
          type: TechStackType.LANGUAGE,
        },
        {
          id: '28',
          name: 'C#',
          iconUrl:
            'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/csharp/csharp-original.svg',
          type: TechStackType.LANGUAGE,
        },
        {
          id: '29',
          name: 'PHP',
          iconUrl:
            'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/php/php-original.svg',
          type: TechStackType.LANGUAGE,
        },
        {
          id: '30',
          name: 'Ruby',
          iconUrl:
            'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/ruby/ruby-original.svg',
          type: TechStackType.LANGUAGE,
        },
        {
          id: '31',
          name: 'Rust',
          iconUrl:
            'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/rust/rust-original.svg',
          type: TechStackType.LANGUAGE,
        },
        {
          id: '43',
          name: 'C',
          iconUrl:
            'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/c/c-original.svg',
          type: TechStackType.LANGUAGE,
        },
        {
          id: '44',
          name: 'C++',
          iconUrl:
            'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/cplusplus/cplusplus-original.svg',
          type: TechStackType.LANGUAGE,
        },
        {
          id: '45',
          name: 'Kotlin',
          iconUrl:
            'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/kotlin/kotlin-original.svg',
          type: TechStackType.LANGUAGE,
        },
        {
          id: '46',
          name: 'Swift',
          iconUrl:
            'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/swift/swift-original.svg',
          type: TechStackType.LANGUAGE,
        },
        {
          id: '47',
          name: 'Scala',
          iconUrl:
            'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/scala/scala-original.svg',
          type: TechStackType.LANGUAGE,
        },
        {
          id: '48',
          name: 'Perl',
          iconUrl:
            'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/perl/perl-original.svg',
          type: TechStackType.LANGUAGE,
        },
        {
          id: '49',
          name: 'Haskell',
          iconUrl:
            'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/haskell/haskell-original.svg',
          type: TechStackType.LANGUAGE,
        },
        {
          id: '50',
          name: 'Elixir',
          iconUrl:
            'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/elixir/elixir-original.svg',
          type: TechStackType.LANGUAGE,
        },
        {
          id: '51',
          name: 'Dart',
          iconUrl:
            'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/dart/dart-original.svg',
          type: TechStackType.LANGUAGE,
        },
        {
          id: '52',
          name: 'Objective-C',
          iconUrl:
            'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/objectivec/objectivec-plain.svg',
          type: TechStackType.LANGUAGE,
        },
        {
          id: '53',
          name: 'Matlab',
          iconUrl:
            'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/matlab/matlab-original.svg',
          type: TechStackType.LANGUAGE,
        },
        {
          id: '54',
          name: 'R',
          iconUrl:
            'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/r/r-original.svg',
          type: TechStackType.LANGUAGE,
        },
        {
          id: '55',
          name: 'Shell',
          iconUrl:
            'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/bash/bash-original.svg',
          type: TechStackType.LANGUAGE,
        },
        // --- Databases & Cloud ---
        {
          id: '11',
          name: 'MongoDB',
          iconUrl:
            'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mongodb/mongodb-original.svg',
          type: TechStackType.TECH,
        },
        {
          id: '12',
          name: 'PostgreSQL',
          iconUrl:
            'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postgresql/postgresql-original.svg',
          type: TechStackType.TECH,
        },
        {
          id: '13',
          name: 'MySQL',
          iconUrl:
            'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mysql/mysql-original.svg',
          type: TechStackType.TECH,
        },
        {
          id: '14',
          name: 'Redis',
          iconUrl:
            'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/redis/redis-original.svg',
          type: TechStackType.TECH,
        },
        {
          id: '18',
          name: 'AWS',
          iconUrl:
            'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/amazonwebservices/amazonwebservices-original-wordmark.svg',
          type: TechStackType.TECH,
        },
        {
          id: '19',
          name: 'GCP',
          iconUrl:
            'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/googlecloud/googlecloud-original.svg',
          type: TechStackType.TECH,
        },
        {
          id: '20',
          name: 'Azure',
          iconUrl:
            'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/microsoftazure/microsoftazure-original.svg',
          type: TechStackType.TECH,
        },
        // --- DevOps, Tools, and Others ---
        {
          id: '15',
          name: 'Tailwind CSS',
          iconUrl:
            'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg',
          type: TechStackType.TECH,
        },
        {
          id: '16',
          name: 'Docker',
          iconUrl:
            'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/docker/docker-plain.svg',
          type: TechStackType.TECH,
        },
        {
          id: '17',
          name: 'Kubernetes',
          iconUrl:
            'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/kubernetes/kubernetes-original.svg',
          type: TechStackType.TECH,
        },
        {
          id: '21',
          name: 'npm',
          iconUrl:
            'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/npm/npm-original-wordmark.svg',
          type: TechStackType.TECH,
        },
        {
          id: '22',
          name: 'Slack',
          iconUrl:
            'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/slack/slack-original.svg',
          type: TechStackType.TECH,
        },
        {
          id: '23',
          name: 'Discord API',
          iconUrl:
            'https://upload.wikimedia.org/wikipedia/fr/thumb/4/4f/Discord_Logo_sans_texte.svg/1818px-Discord_Logo_sans_texte.svg.png',
          type: TechStackType.TECH,
        },
        {
          id: '24',
          name: 'Markdown',
          iconUrl:
            'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/markdown/markdown-original.svg',
          type: TechStackType.TECH,
        },
        {
          id: '25',
          name: 'Figma',
          iconUrl:
            'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/figma/figma-original.svg',
          type: TechStackType.TECH,
        },
        {
          id: '56',
          name: 'Jenkins',
          iconUrl:
            'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/jenkins/jenkins-original.svg',
          type: TechStackType.TECH,
        },
        {
          id: '57',
          name: 'Travis CI',
          iconUrl:
            'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/travis/travis-plain.svg',
          type: TechStackType.TECH,
        },
        {
          id: '58',
          name: 'GitHub Actions',
          iconUrl:
            'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/github/github-original.svg',
          type: TechStackType.TECH,
        },
        {
          id: '59',
          name: 'Webpack',
          iconUrl:
            'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/webpack/webpack-original.svg',
          type: TechStackType.TECH,
        },
        {
          id: '60',
          name: 'Vite',
          iconUrl:
            'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vite/vite-original.svg',
          type: TechStackType.TECH,
        },
        {
          id: '61',
          name: 'Jest',
          iconUrl:
            'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/jest/jest-plain.svg',
          type: TechStackType.TECH,
        },
        {
          id: '62',
          name: 'Mocha',
          iconUrl:
            'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mocha/mocha-plain.svg',
          type: TechStackType.TECH,
        },
        {
          id: '63',
          name: 'Cypress',
          iconUrl:
            'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/cypressio/cypressio-original.svg',
          type: TechStackType.TECH,
        },
        {
          id: '64',
          name: 'GraphQL',
          iconUrl:
            'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/graphql/graphql-plain.svg',
          type: TechStackType.TECH,
        },
        {
          id: '65',
          name: 'Apollo',
          iconUrl:
            'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/apollographql/apollographql-original.svg',
          type: TechStackType.TECH,
        },
        {
          id: '66',
          name: 'Redux',
          iconUrl:
            'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/redux/redux-original.svg',
          type: TechStackType.TECH,
        },
        {
          id: '67',
          name: 'Sass',
          iconUrl:
            'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/sass/sass-original.svg',
          type: TechStackType.TECH,
        },
        {
          id: '68',
          name: 'Less',
          iconUrl:
            'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/less/less-plain-wordmark.svg',
          type: TechStackType.TECH,
        },
        {
          id: '69',
          name: 'Bootstrap',
          iconUrl:
            'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/bootstrap/bootstrap-original.svg',
          type: TechStackType.TECH,
        },
        {
          id: '70',
          name: 'Material-UI',
          iconUrl:
            'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/materialui/materialui-original.svg',
          type: TechStackType.TECH,
        },
        {
          id: '71',
          name: 'HTML',
          iconUrl:
            'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/html5/html5-original.svg',
          type: TechStackType.LANGUAGE,
        },
        {
          id: '72',
          name: 'CSS',
          iconUrl:
            'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/css3/css3-original.svg',
          type: TechStackType.LANGUAGE,
        },
      ];

      for (const techStack of techStacks) {
        await this.techStack.create({ data: techStack });
      }
      this.Logger.log('Base de données initialisée avec les technologies');
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
      this.Logger.log('Base de données initialisée avec les catégories');
    }
  }
  async onModuleDestroy() {
    await this.$disconnect();
  }
}
