import { Module } from '@nestjs/common';
import { CATEGORY_REPOSITORY_PORT } from '@/contexts/category/use-cases/ports/category.repository.port';
import { MockCategoryRepository } from '@/contexts/category/infrastructure/repositories/mock.category.repository';

@Module({
  providers: [
    { provide: CATEGORY_REPOSITORY_PORT, useClass: MockCategoryRepository },
  ],
  exports: [CATEGORY_REPOSITORY_PORT],
})
export class CategoryInfrastructure {}
