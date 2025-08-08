import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { ContextsModule } from './contexts/contexts.module';
import { HealthModule } from './health/health.module';
import { MediaInfrastructure } from './media/infrastructure/media.infrastructure';
import { auth } from '@/libs/auth';
import { AuthModule as BetterAuthModule } from '@thallesp/nestjs-better-auth';
// import { AuthModule } from './auth/auth.module';
import { BetterAuthGithubHook } from '@/auth/hooks/better-auth-github.hook';

@Module({
  imports: [
    CqrsModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    BetterAuthModule.forRoot(auth),
    ContextsModule,
    HealthModule,
    MediaInfrastructure,
  ],
  controllers: [],
  providers: [BetterAuthGithubHook],
})
export class RootModule {}
