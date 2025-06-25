import { Controller, UseGuards } from '@nestjs/common';
import { GithubAuthGuard } from '../guards/github-auth.guard';

@Controller('github')
@UseGuards(GithubAuthGuard)
export class GithubController {
  constructor() {}
}
