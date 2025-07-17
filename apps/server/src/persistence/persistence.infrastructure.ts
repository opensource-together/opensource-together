import { Module } from '@nestjs/common';
import { PrismaService } from './orm/prisma/services/prisma.service';

@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PersistenceInfrastructure {}
