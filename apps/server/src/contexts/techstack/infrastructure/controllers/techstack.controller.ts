import { TechStack } from '@/contexts/techstack/domain/techstack.entity';
import { GetAllTechStacksQuery } from '@/contexts/techstack/use-cases/queries/get-all-techstacks.query';
import { Result } from '@/libs/result';
import { Controller, Get } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PublicAccess } from 'supertokens-nestjs';

@ApiTags('Tech Stacks')
@Controller('techstacks')
export class TechStackController {
  constructor(private readonly queryBus: QueryBus) {}

  @PublicAccess()
  @Get()
  @ApiOperation({ summary: 'Récupérer toutes les technologies disponibles' })
  @ApiResponse({
    status: 200,
    description: 'Liste de toutes les technologies disponibles',
    example: [
      {
        id: '1',
        name: 'React',
        iconUrl: 'https://react.dev/logo-og.png',
        type: 'TECH',
      },
      {
        id: '2',
        name: 'Next.js',
        iconUrl: 'https://nextjs.org/static/favicon/favicon-32x32.png',
        type: 'TECH',
      },
      {
        id: '3',
        name: 'TypeScript',
        iconUrl: 'https://www.typescriptlang.org/static/images/logo.svg',
        type: 'LANGUAGE',
      },
      {
        id: '4',
        name: 'Tailwind CSS',
        iconUrl: 'https://tailwindcss.com/favicon.ico',
        type: 'TECH',
      },
      {
        id: '5',
        name: 'Prisma',
        iconUrl: 'https://www.prisma.io/favicon.ico',
        type: 'TECH',
      },
      {
        id: '6',
        name: 'PostgreSQL',
        iconUrl: 'https://www.postgresql.org/favicon.ico',
        type: 'LANGUAGE',
      },
      {
        id: '7',
        name: 'Docker',
        iconUrl: 'https://www.docker.com/favicon.ico',
        type: 'TECH',
      },
    ],
  })
  @ApiResponse({
    status: 500,
    description: 'Erreur serveur lors de la récupération des technologies',
    example: {
      message: 'Internal server error',
      statusCode: 500,
    },
  })
  async getAllTechStacks(): Promise<
    { languages: TechStack[]; technologies: TechStack[] } | { error: string }
  > {
    const result: Result<TechStack[], string> = await this.queryBus.execute(
      new GetAllTechStacksQuery(),
    );

    if (!result.success) {
      return { error: result.error };
    }

    const languages = result.value.filter(
      (ts) => ts.toPrimitive().type === 'LANGUAGE',
    );
    const technologies = result.value.filter(
      (ts) => ts.toPrimitive().type === 'TECH',
    );

    return { languages, technologies };
  }
}
