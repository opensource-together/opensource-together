import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { CategoryController } from './controllers/category.controller';
import { CategoryRepository } from './repositories/category.repository';
import { CATEGORY_REPOSITORY } from './repositories/category.repository.interface';
import { CategoryService } from './services/category.service';

@Module({
  imports: [PrismaModule],
  controllers: [CategoryController],
  providers: [
    {
      provide: CATEGORY_REPOSITORY,
      useClass: CategoryRepository,
    },
    CategoryService,
  ],
  exports: [CATEGORY_REPOSITORY, CategoryService],
})
export class CategoryModule {}
