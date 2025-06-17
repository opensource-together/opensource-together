import { FindUserByIdQuery } from '@/application/user/queries/find-user-by-id.query';
import { Controller, Get, NotFoundException } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { Session } from 'supertokens-nestjs';
import { Result } from '@/shared/result';
import { User } from '@/domain/user/user.entity';
import { ApiOkResponse, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('user')
export class UserController {
  constructor(private readonly queryBus: QueryBus) {}

  @ApiOkResponse({ type: User })
  @ApiOperation({ summary: 'Get the current user' })
  @ApiResponse({ status: 200, description: 'User found' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @Get('me')
  async getMe(@Session('userId') userId: string) {
    const result: Result<User, string> = await this.queryBus.execute(
      new FindUserByIdQuery(userId),
    );
    if (!result.success) {
      throw new NotFoundException(result.error);
    }
    return result.value;
  }
}
