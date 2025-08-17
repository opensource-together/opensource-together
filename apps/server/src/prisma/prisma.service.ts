import {
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
  Logger,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  private readonly prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient({
      datasources: { db: { url: process.env.DATABASE_URL } },
      errorFormat: 'minimal',
    });
  }

  async onModuleInit() {
    await this.prisma.$connect();
    Logger.log('Connected to Database', 'Prisma');
  }

  getClient(): PrismaClient {
    return this.prisma;
  }

  async onModuleDestroy() {
    await this.prisma.$disconnect();
  }
}
