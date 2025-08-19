import { Controller, Post, UseGuards } from '@nestjs/common';
import { ProjectRoleService } from '../services/project-role.service';
import { CreateProjectRoleDto } from '../domain/project-role';
import { Body } from '@nestjs/common';
import { Session, UserSession } from '@thallesp/nestjs-better-auth';
import { AuthGuard } from '@thallesp/nestjs-better-auth';
import { CreateProjectRoleRequestDto } from './dto/create-project-role.request.dto';

@UseGuards(AuthGuard)
@Controller('project-role')
export class ProjectRoleController {
  constructor(private readonly projectRoleService: ProjectRoleService) {}

  @Post()
  async createProjectRole(
    @Session() session: UserSession,
    @Body() projectRole: CreateProjectRoleRequestDto[],
  ) {}
}
