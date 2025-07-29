import { FindUserApplicationsQuery } from '@/contexts/user/use-cases/queries/find-user-applications.query';
import { UpdateUserCommand } from '@/contexts/user/use-cases/commands/update-user.command';
import { DeleteUserCommand } from '@/contexts/user/use-cases/commands/delete-user.command';
import { FindUserByIdQuery } from '@/contexts/user/use-cases/queries/find-user-by-id.query';
import { User } from '@/contexts/user/domain/user.entity';
import { Result } from '@/libs/result';
import {
  Controller,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  HttpException,
  HttpStatus,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { QueryBus, CommandBus } from '@nestjs/cqrs';
import {
  ApiCookieAuth,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiTags,
} from '@nestjs/swagger';
import { Session, PublicAccess } from 'supertokens-nestjs';

// DTO simple pour la mise à jour d'utilisateur
export class UpdateUserRequestDto {
  name?: string;
  avatarUrl?: string;
  bio?: string;
  location?: string;
  company?: string;
  socialLinks?: {
    github?: string;
    website?: string;
    twitter?: string;
    linkedin?: string;
    discord?: string;
  };
  techStacks?: string[];
  experiences?: {
    company: string;
    position: string;
    startDate: string;
    endDate?: string;
  }[];
  projects?: { name: string; description: string; url: string }[];
}

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  @Get('me')
  @ApiOperation({ summary: "Récupérer le profil de l'utilisateur courant" })
  @ApiCookieAuth('sAccessToken')
  @ApiResponse({
    status: 200,
    description: 'Profil utilisateur retourné avec succès',
  })
  @ApiResponse({
    status: 404,
    description: 'Utilisateur non trouvé',
  })
  async getMyProfile(@Session('userId') userId: string) {
    console.log('userId', userId);
    const result: Result<User, string> = await this.queryBus.execute(
      new FindUserByIdQuery(userId),
    );
    console.log('result', result);

    if (!result.success) {
      throw new NotFoundException(result.error);
    }

    return result.value.toPrimitive();
  }

  @PublicAccess()
  @Get(':id')
  @ApiOperation({ summary: 'Récupérer un utilisateur par son ID' })
  @ApiParam({
    name: 'id',
    description: "ID de l'utilisateur",
    example: '43a39f90-1718-470d-bcef-c7ebeb972c0d',
  })
  @ApiResponse({
    status: 200,
    description: 'Utilisateur retourné avec succès',
  })
  @ApiResponse({
    status: 404,
    description: 'Utilisateur non trouvé',
  })
  async getUserById(@Param('id') id: string) {
    const result: Result<User, string> = await this.queryBus.execute(
      new FindUserByIdQuery(id),
    );

    if (!result.success) {
      throw new NotFoundException(result.error);
    }

    return result.value.toPrimitive();
  }

  @Patch('me')
  @ApiOperation({ summary: "Mettre à jour le profil de l'utilisateur courant" })
  @ApiCookieAuth('sAccessToken')
  @ApiBody({
    description: 'Données de mise à jour du profil',
    type: UpdateUserRequestDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Profil mis à jour avec succès',
  })
  @ApiResponse({
    status: 400,
    description: 'Erreur de validation',
  })
  @ApiResponse({
    status: 404,
    description: 'Utilisateur non trouvé',
  })
  async updateMyProfile(
    @Session('userId') userId: string,
    @Body() updateUserDto: UpdateUserRequestDto,
  ) {
    const result: Result<User, string> = await this.commandBus.execute(
      new UpdateUserCommand(userId, updateUserDto),
    );

    if (!result.success) {
      if (result.error === 'User not found') {
        throw new NotFoundException(result.error);
      }
      throw new HttpException(result.error, HttpStatus.BAD_REQUEST);
    }

    return result.value.toPrimitive();
  }

  @Delete('me')
  @ApiOperation({ summary: "Supprimer le profil de l'utilisateur courant" })
  @ApiCookieAuth('sAccessToken')
  @ApiResponse({
    status: 200,
    description: 'Utilisateur supprimé avec succès',
    example: {
      message: 'User deleted successfully',
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Utilisateur non trouvé',
  })
  async deleteMyProfile(
    @Session('userId') userId: string,
  ): Promise<{ message: string }> {
    const result: Result<void, string> = await this.commandBus.execute(
      new DeleteUserCommand(userId),
    );

    if (!result.success) {
      if (result.error === 'User not found') {
        throw new NotFoundException(result.error);
      }
      throw new HttpException(result.error, HttpStatus.BAD_REQUEST);
    }

    return { message: 'User deleted successfully' };
  }

  @Get('applications')
  @ApiCookieAuth()
  @ApiOperation({ summary: 'Get all applications for a user' })
  @ApiResponse({
    status: 200,
    description: 'Liste des candidatures',
    example: [
      {
        appplicationId: '672e9a56-e22c-4848-b68d-2c2845b7a7ba',
        projectRoleId: '15858a85-6d77-4065-b479-afa34395610f',
        projectRoleTitle: 'Dev front',
        status: 'PENDING',
        selectedKeyFeatures: ['auth'],
        selectedProjectGoals: ['progres'],
        appliedAt: '2025-07-22T13:08:06.914Z',
        decidedAt: '2025-07-22T14:35:48.838Z',
        decidedBy: '',
        rejectionReason: '',
        motivationLetter: 'Je vais faire ca et ci etc ca',
      },
    ],
  })
  async getApplications(@Session('userId') userId: string) {
    const applications: Result<
      {
        appplicationId: string;
        projectRoleId: string;
        projectTitle: string;
        projectDescription: string;
        projectRoleTitle: string;
        projectRoleDescription: string;
        status: string;
        selectedKeyFeatures: string[];
        selectedProjectGoals: string[];
        appliedAt: Date;
        decidedAt: Date;
        decidedBy: string;
        rejectionReason: string;
        motivationLetter: string;
      }[]
    > = await this.queryBus.execute(new FindUserApplicationsQuery({ userId }));

    if (!applications.success) {
      throw new HttpException(applications.error, HttpStatus.BAD_REQUEST);
    }

    return applications.value;
  }
}
