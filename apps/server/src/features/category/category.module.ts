import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { PrismaCategoryRepository } from './repositories/prisma.category.repository';
import { CATEGORY_REPOSITORY } from './repositories/category.repository.interface';

@Module({
  imports: [PrismaModule],
  providers: [
    { provide: CATEGORY_REPOSITORY, useClass: PrismaCategoryRepository },
  ],
  exports: [CATEGORY_REPOSITORY],
})
export class CategoryModule {}
