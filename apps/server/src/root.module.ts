import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { ContextsModule } from './contexts/contexts.module';
import { HealthModule } from './health/health.module';
import { MediaInfrastructure } from './media/infrastructure/media.infrastructure';
import { AuthGuard, AuthModule } from '@thallesp/nestjs-better-auth';
import { auth } from './libs/auth';
import { BetterAuthGithubHook } from './auth/hooks/better-auth-github.hook';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    CqrsModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule.forRoot(auth, {
      disableTrustedOriginsCors: false,
      disableExceptionFilter: false,
      disableBodyParser: false,
    }),
    ContextsModule,
    HealthModule,
    MediaInfrastructure,
  ],
  controllers: [],
  providers: [
    BetterAuthGithubHook,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class RootModule {}
