import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { CategoryController } from './controllers/category.controller';
import { CATEGORY_REPOSITORY } from './repositories/category.repository.interface';
import { CategoryService } from './services/category.service';
import { PrismaCategoryRepository } from './repositories/prisma.category.repository';

@Module({
  imports: [PrismaModule],
  controllers: [CategoryController],
  providers: [
    {
      provide: CATEGORY_REPOSITORY,
      useClass: PrismaCategoryRepository,
    },
    CategoryService,
  ],
  exports: [CATEGORY_REPOSITORY, CategoryService],
})
export class CategoryModule {}
