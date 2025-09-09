import {
  Controller,
  Body,
  Post,
  Get,
  UseGuards,
  BadRequestException,
  Inject,
} from '@nestjs/common';
import { ProjectService } from '../services/project.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { AuthGuard, Session, UserSession } from '@thallesp/nestjs-better-auth';
import {
  MAILING_SERVICE,
  MailingServicePort,
} from '@/mailing/mailing.interface';

@Controller('projects')
@UseGuards(AuthGuard)
export class ProjectController {
  constructor(
    private readonly projectService: ProjectService,
    @Inject(MAILING_SERVICE)
    private readonly mailingService: MailingServicePort,
  ) {}

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

    const emailResult = await this.mailingService.sendEmail({
      to: 'claudantkylian@gmail.com',
      subject: 'Nouveau projet créé',
      html: `<p>Un nouveau projet a été créé : <strong>${title}</strong></p><p>Description : ${description}</p>`,
    });

    if (!emailResult.success) {
      throw new BadRequestException("Erreur lors de l'envoi de l'email");
    }

    return result.value;
  }
}
