import { Module } from '@nestjs/common';
import { SuperTokensModule } from 'supertokens-nestjs';
import { createSupertokensConfig } from '@infrastructures/auth/supertokens.config';
import { SuperTokensModuleOptions } from 'supertokens-nestjs/dist/supertokens.types';
import { RepositoryModule } from '@infrastructures/repositories/repository.module';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
@Module({
  imports: [
    RepositoryModule,
    SuperTokensModule.forRootAsync({
      imports: [AuthModule],
      inject: [CommandBus, QueryBus],
      useFactory: (
        commandBus: CommandBus,
        queryBus: QueryBus,
      ): SuperTokensModuleOptions =>
        createSupertokensConfig({
          commandBus,
          queryBus,
        }),
    }),
  ],
  providers: [CommandBus, QueryBus],
  exports: [],
})
export class AuthModule {}
