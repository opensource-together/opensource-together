import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { SuperTokensAuthGuard } from 'supertokens-nestjs';
import { AuthModule } from '@/auth/auth.module';
import { CqrsModule } from '@nestjs/cqrs';
import { WiringModule } from '@infrastructures/wiring/wiring.module';
import { PresentModule } from './presentation/present.module';
import { ContextsModule } from './contexts/contexts.module';
@Module({
  imports: [
    CqrsModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    ContextsModule,
    WiringModule,
    PresentModule,
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
