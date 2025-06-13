import { FindUserByIdQuery } from '@/application/user/queries/find-user-by-id.query';
import { Controller, Get } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { Session } from 'supertokens-nestjs';
import { Result } from '@/shared/result';
import { User } from '@/domain/user/user.entity';

@Controller('user')
export class UserController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get('me')
  async getMe(@Session('userId') userId: string) {
    const result: Result<User, string> = await this.queryBus.execute(
      new FindUserByIdQuery(userId),
    );
    return result;
  }
}
