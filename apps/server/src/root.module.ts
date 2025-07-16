import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { SuperTokensAuthGuard } from 'supertokens-nestjs';
import { AuthModule } from '@/auth/auth.module';
import { CqrsModule } from '@nestjs/cqrs';
import { ContextsModule } from './contexts/contexts.module';
import { HealthModule } from './health/health.module';
import { BucketInfrastructure } from './bucket/infrastructure/bucket.infrastructure';
@Module({
  imports: [
    CqrsModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    ContextsModule,
    HealthModule,
    BucketInfrastructure,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: SuperTokensAuthGuard,
    },
  ],
})
export class RootModule {}
