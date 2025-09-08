import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard, Session, UserSession } from '@thallesp/nestjs-better-auth';
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
    @Body() projectRoles: CreateProjectRoleRequestDto,
  ) {
    const roles = projectRoles.projectRoles;
    const result = await this.projectRoleService.createProjectRole(
      projectId,
      roles,
    );
    if (!result.success) {
      throw new HttpException(result.error, HttpStatus.BAD_REQUEST);
    }
    return result.value;
  }

  @Patch(':roleId')
  @UpdateProjectRoleByIdDocs()
  async updateProjectRole(
    @Param('roleId') roleId: string,
    @Body() projectRole: UpdateProjectRoleDto,
  ) {
    const result = await this.projectRoleService.updateProjectRole(
      roleId,
      projectRole,
    );
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
  async deleteProjectRole(@Param('roleId') roleId: string) {
    const result = await this.projectRoleService.deleteProjectRole(roleId);
    if (!result.success) {
      throw new HttpException(result.error, HttpStatus.BAD_REQUEST);
    }
    return;
  }
}
