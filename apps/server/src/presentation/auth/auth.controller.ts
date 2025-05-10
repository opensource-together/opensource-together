import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { SignInDto } from './dto/signin.dto';
import { SignUpDto } from './dto/signup.dto';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { PublicAccess } from 'supertokens-nestjs';
import { RegisterUserCommand } from '@/application/auth/commands/register-user.command';
import { Result } from '@/shared/result';
import { User } from '@domain/user/user.entity';
import { SignInUserCommand } from '@/application/auth/commands/signin-user.command';
@Controller('auth')
export class AuthController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}
  @PublicAccess()
  @Post('signin')
  async signin(@Body() signinDto: SignInDto) {
    console.log('je passe par ce controller');
    console.log(signinDto);
    const email = signinDto.formFields.find(
      (field) => field.id === 'email',
    )?.value;
    const password = signinDto.formFields.find(
      (field) => field.id === 'password',
    )?.value;
    if (!email || !password) {
      throw new HttpException(
        'Email and password are required',
        HttpStatus.BAD_REQUEST,
      );
    }
    const result: Result<any, string> = await this.commandBus.execute(
      new SignInUserCommand(email, password),
    );
    return result;
  }

  @PublicAccess()
  @Post('signup')
  async signup(@Body() signupDto: SignUpDto) {
    const email = signupDto.formFields.find(
      (field) => field.id === 'email',
    )?.value;
    const password = signupDto.formFields.find(
      (field) => field.id === 'password',
    )?.value;
    const username = signupDto.formFields.find(
      (field) => field.id === 'username',
    )?.value;
    if (!email || !password || !username) {
      throw new HttpException(
        'All fields are required',
        HttpStatus.BAD_REQUEST,
      );
    }
    const result: Result<User, string | { username?: string; email?: string }> =
      await this.commandBus.execute(
        new RegisterUserCommand(email, password, username),
      );
    if (result.success) {
      return result.value;
    }
    throw new HttpException(result.error, HttpStatus.BAD_REQUEST);
  }
}
