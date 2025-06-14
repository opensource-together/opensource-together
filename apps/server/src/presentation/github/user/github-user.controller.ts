import { toGithubUserDto } from '@/application/dto/adapters/github/github-user.adapter';
import { GithubAuthGuard } from '@/presentation/guards/github-auth.guard';
import { GithubAuthRequest } from '@/presentation/types/github-auth-request.interface';
import {
  Controller,
  Get,
  InternalServerErrorException,
  Req,
  UseGuards,
} from '@nestjs/common';
import { GithubUserDto } from '@/application/dto/adapters/github/github-user.dto';

@Controller('github/user')
@UseGuards(GithubAuthGuard)
export class GithubUserController {
  constructor() {}

  @Get('me')
  async getUser(@Req() req: GithubAuthRequest): Promise<GithubUserDto> {
    const user = await req.octokit.rest.users.getAuthenticated();
    if (!user.data) {
      throw new InternalServerErrorException();
    }

    const userDto = toGithubUserDto(user.data);
    if (!userDto.success) {
      throw new InternalServerErrorException();
    }
    return userDto.value;
  }
}
