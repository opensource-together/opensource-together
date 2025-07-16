import { Controller, Get } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { GetAllCategoriesQuery } from '@/contexts/category/use-cases/queries/get-all-categories.query';
import { Category } from '@/contexts/category/domain/category.entity';
import { Result } from '@/libs/result';
import { PublicAccess } from 'supertokens-nestjs';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Categories')
@Controller('categories')
export class CategoryController {
  constructor(private readonly queryBus: QueryBus) {}

  @PublicAccess()
  @Get()
  @ApiOperation({ summary: 'Récupérer toutes les catégories de projets' })
  @ApiResponse({
    status: 200,
    description: 'Liste de toutes les catégories disponibles',
    example: [
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
    ],
  })
  @ApiResponse({
    status: 500,
    description: 'Erreur serveur lors de la récupération des catégories',
    example: {
      message: 'Internal server error',
      statusCode: 500,
    },
  })
  async getAllCategories(): Promise<Category[] | { error: string }> {
    const result: Result<Category[], string> = await this.queryBus.execute(
      new GetAllCategoriesQuery(),
    );

    if (!result.success) {
      return { error: result.error };
    }

    return result.value;
  }
}
