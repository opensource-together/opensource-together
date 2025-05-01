import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { SuperTokensAuthGuard } from 'supertokens-nestjs';
import { AuthModule } from '@infrastructures/auth/auth.module';
import { CqrsModule } from '@nestjs/cqrs';
import { CqrsWiringModule } from '@infrastructures/cqrs/cqrs-wiring.module';
import { PresentModule } from './presentation/present.module';
@Module({
  imports: [
    CqrsModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    CqrsWiringModule,
    PresentModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: SuperTokensAuthGuard,
    },
  ],
})
export class AppModule {}
