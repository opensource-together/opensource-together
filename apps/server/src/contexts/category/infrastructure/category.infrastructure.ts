import { Module } from '@nestjs/common';
import { CATEGORY_REPOSITORY_PORT } from '@/contexts/category/use-cases/ports/category.repository.port';
import { MockCategoryRepository } from '@/contexts/category/infrastructure/repositories/mock.category.repository';
import { PrismaCategoryRepository } from '@/contexts/category/infrastructure/repositories/prisma.category.repository';
import { PrismaService } from '@/orm/prisma/prisma.service';
import { categoryUseCases } from '../use-cases/category.use-cases';
import { CategoryController } from './controllers/category.controller';

@Module({
  providers: [
    PrismaService,
    {
      provide: CATEGORY_REPOSITORY_PORT,
      useClass:
        process.env.NODE_ENV === 'test'
          ? MockCategoryRepository
          : PrismaCategoryRepository,
    },
    ...categoryUseCases,
  ],
  controllers: [CategoryController],
  exports: [CATEGORY_REPOSITORY_PORT],
})
export class CategoryInfrastructure {}
