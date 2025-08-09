import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { ContextsModule } from './contexts/contexts.module';
import { HealthModule } from './health/health.module';
import { MediaInfrastructure } from './media/infrastructure/media.infrastructure';
import {
  AuthGuard,
  AuthModule as BetterAuthModule,
} from '@thallesp/nestjs-better-auth';
import { auth } from './libs/auth';
import { APP_GUARD } from '@nestjs/core';
import { AuthModule } from '@/auth/auth.module';

@Module({
  imports: [
    CqrsModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    BetterAuthModule.forRoot(auth, {
      disableTrustedOriginsCors: false,
      disableExceptionFilter: false,
      disableBodyParser: false,
    }),
    ContextsModule,
    HealthModule,
    MediaInfrastructure,
    AuthModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class RootModule {}
