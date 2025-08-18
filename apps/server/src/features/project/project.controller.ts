import {
  Controller,
  Body,
  Post,
  Get,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { ProjectService } from './services/project.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { AuthGuard, Session, UserSession } from '@thallesp/nestjs-better-auth';

@Controller('projects')
@UseGuards(AuthGuard)
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Get()
  getProjects() {
    return [];
  }
  @Post()
  async createProject(
    @Session() session: UserSession,
    @Body() createProjectDto: CreateProjectDto,
  ) {
    const userId = session.user.id;
    const { title, description, categories, techStacks } = createProjectDto;
    const result = await this.projectService.createProject({
      ownerId: userId,
      title,
      description,
      categories,
      techStacks,
      projectRoles: createProjectDto.projectRoles || [],
    });
    if (!result.success) {
      throw new BadRequestException(result.error);
    }
    return result.value;
  }
}
