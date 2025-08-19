import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from 'prisma/prisma.module';
import { AuthModule } from '@thallesp/nestjs-better-auth';
import { auth } from '@/auth/auth';
import { FeaturesModule } from './features/features.module';

@Module({
  imports: [PrismaModule, AuthModule.forRoot(auth), FeaturesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
