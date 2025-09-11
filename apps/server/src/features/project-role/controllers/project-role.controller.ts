import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
  HttpCode,
} from '@nestjs/common';
import {
  AuthGuard,
  Public,
  Session,
  UserSession,
} from '@thallesp/nestjs-better-auth';
import { ProjectRoleService } from '../services/project-role.service';
import { CreateProjectRoleDocs } from './docs/create-project-role.swagger.decorator';
import { DeleteProjectRoleByIdDocs } from './docs/delete-project-role-by-id.swagger.decorator';
import { FindAllProjectRolesDocs } from './docs/find-all-project-roles.swagger.decorator';
import { FindProjectRoleByIdDocs } from './docs/find-project-role-by-id.swagger.decorator';
import { UpdateProjectRoleByIdDocs } from './docs/update-project-role-by-id.swagger.decorator';
import { CreateProjectRoleRequestDto } from './dto/create-project-role.request.dto';
import { UpdateProjectRoleDto } from './dto/update-project-role.dto';

@UseGuards(AuthGuard)
@Controller('projects/:projectId/roles')
export class ProjectRoleController {
  constructor(private readonly projectRoleService: ProjectRoleService) {}

  @Get()
  @Public()
  @FindAllProjectRolesDocs()
  async getAllProjectRoles(@Param('projectId') projectId: string) {
    const result = await this.projectRoleService.getAllProjectRoles(projectId);
    if (!result.success) {
      throw new HttpException(result.error, HttpStatus.BAD_REQUEST);
    }
    return result.value;
  }

  @Post()
  @CreateProjectRoleDocs()
  async createProjectRole(
    @Session() session: UserSession,
    @Param('projectId') projectId: string,
    @Body() projectRole: CreateProjectRoleRequestDto,
  ) {
    const userId = session.user.id;
    const result = await this.projectRoleService.createProjectRole({
      userId,
      projectId,
      projectRole: [projectRole],
    });
    if (!result.success) {
      throw new HttpException(result.error, HttpStatus.BAD_REQUEST);
    }
    return result.value;
  }

  @Patch(':roleId')
  @UpdateProjectRoleByIdDocs()
  async updateProjectRole(
    @Session() session: UserSession,
    @Param('roleId') roleId: string,
    @Param('projectId') projectId: string,
    @Body() projectRole: UpdateProjectRoleDto,
  ) {
    const userId = session.user.id;
    const result = await this.projectRoleService.updateProjectRole({
      roleId,
      userId,
      projectId,
      projectRole,
    });
    if (!result.success) {
      throw new HttpException(result.error, HttpStatus.BAD_REQUEST);
    }
    return result.value;
  }

  @Get(':roleId')
  @FindProjectRoleByIdDocs()
  async getProjectRole(@Param('roleId') roleId: string) {
    const result = await this.projectRoleService.getProjectRole(roleId);
    if (!result.success) {
      throw new HttpException(result.error, HttpStatus.BAD_REQUEST);
    }
    return result.value;
  }

  @Delete(':roleId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @DeleteProjectRoleByIdDocs()
  async deleteProjectRole(
    @Session() session: UserSession,
    @Param('roleId') roleId: string,
    @Param('projectId') projectId: string,
  ) {
    const userId = session.user.id;
    const result = await this.projectRoleService.deleteProjectRole({
      roleId,
      userId,
      projectId,
    });
    if (!result.success) {
      throw new HttpException(result.error, HttpStatus.BAD_REQUEST);
    }
    return;
  }
}
