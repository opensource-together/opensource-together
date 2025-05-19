import { Module } from '@nestjs/common';
import { SuperTokensModule } from 'supertokens-nestjs';
import { RepositoryModule } from '@infrastructures/repositories/repository.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { createSupertokensConfig } from '@infrastructures/auth/supertokens.config';
import { QueryBus } from '@nestjs/cqrs';
import { CommandBus } from '@nestjs/cqrs';

@Module({
  imports: [
    RepositoryModule,
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
  providers: [],
  controllers: [],
})
export class AuthModule {}
