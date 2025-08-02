import { Controller, Get, Req, Res, UseGuards, All } from '@nestjs/common';
import { Request, Response } from 'express';
import {
  AuthGuard,
  Session,
  UserSession,
  AuthService,
} from '@thallesp/nestjs-better-auth';

import { auth } from '../../libs/auth';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService<typeof auth>) {}

  @All('*')
  handleAuthRequest(@Req() req: Request, @Res() res: Response) {
    console.log(req.url);
    return this.authService.api.handler(req, res);
  }

  @Get('me')
  @UseGuards(AuthGuard)
  getProfile(@Session() session: UserSession) {
    console.log(session);
    return { user: session.user };
  }
}
