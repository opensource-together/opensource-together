import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from 'prisma/prisma.module';
import { AuthModule } from '@thallesp/nestjs-better-auth';
import { auth } from '@/auth/auth';
import { FeaturesModule } from './features/features.module';
import { ProfileModule } from '@/features/profile/profile.module';
import { HealthModule } from './health/health.module';
import { MailingModule } from '@/mailing/mailing.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule.forRoot(auth),
    FeaturesModule,
    ProfileModule,
    HealthModule,
    MailingModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
