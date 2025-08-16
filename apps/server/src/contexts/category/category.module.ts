import { Module } from '@nestjs/common';
import { CATEGORY_REPOSITORY_PORT } from '@/contexts/category/ports/category.repository.port';
import { MockCategoryRepository } from '@/contexts/category/repositories/mock.category.repository';
import { PrismaCategoryRepository } from '@/contexts/category/repositories/prisma.category.repository';
import { PersistenceInfrastructure } from '@/persistence/persistence.infrastructure';
import { CategoryController } from './controllers/category.controller';

@Module({
  imports: [PersistenceInfrastructure],
  providers: [
    {
      provide: CATEGORY_REPOSITORY_PORT,
      useClass:
        process.env.NODE_ENV === 'test'
          ? MockCategoryRepository
          : PrismaCategoryRepository,
    },
  ],
  controllers: [CategoryController],
  exports: [CATEGORY_REPOSITORY_PORT],
})
export class CategoryInfrastructure {}
