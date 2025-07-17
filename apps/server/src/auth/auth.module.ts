import { Module } from '@nestjs/common';
import { SuperTokensModule } from 'supertokens-nestjs';
// import { RepositoryModule } from '@/infrastructure/repositories/repository.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { createSupertokensConfig } from '@/auth/supertokens.config';
import { QueryBus } from '@nestjs/cqrs';
import { CommandBus } from '@nestjs/cqrs';
import { PersistenceInfrastructure } from '@/persistence/persistence.infrastructure';
import { AuthController } from '@/auth/controllers/auth.controller';

@Module({
  imports: [
    PersistenceInfrastructure,
    // RepositoryModule,
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
  controllers: [AuthController],
})
export class AuthModule {}
