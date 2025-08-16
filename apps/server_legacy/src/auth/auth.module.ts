import { Module } from '@nestjs/common';
import { SuperTokensModule } from 'supertokens-nestjs';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { createSupertokensConfig } from '@/auth/supertokens.config';
import { QueryBus } from '@nestjs/cqrs';
import { CommandBus } from '@nestjs/cqrs';
import { PersistenceInfrastructure } from '@/persistence/persistence.infrastructure';
import { AuthController } from '@/auth/controllers/auth.controller';
import { APP_GUARD } from '@nestjs/core';
import { SuperTokensAuthGuard } from 'supertokens-nestjs';

@Module({
  imports: [
    PersistenceInfrastructure,
    ConfigModule,
    SuperTokensModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (
        configService: ConfigService,
        commandBus: CommandBus,
        queryBus: QueryBus,
      ) => {
        return createSupertokensConfig(queryBus, commandBus, configService);
      },
      inject: [ConfigService, CommandBus, QueryBus],
    }),
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: SuperTokensAuthGuard,
    },
  ],
  controllers: [AuthController],
})
export class AuthModule {}
