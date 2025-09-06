import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import {
  CreateProjectRoleDto,
  ProjectRoleRepository,
} from './project-role.repository.interface';
import { UpdateProjectRoleDto } from '../controllers/dto/update-project-role.dto';

@Injectable()
export class PrismaProjectRoleRepository implements ProjectRoleRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    projectId: string,
    projectRoles: CreateProjectRoleDto[],
  ): Promise<any> {
    try {
      console.log('data', projectRoles);

      // Utiliser create() au lieu de createMany() pour supporter les relations
      const results = await Promise.all(
        projectRoles.map((role) =>
          this.prisma.projectRole.create({
            data: {
              projectId: projectId,
              title: role.title,
              description: role.description,
              isFilled: false,
              techStacks: {
                connect: role.techStacks.map((tech) => ({ id: tech })),
              },
            },
          }),
        ),
      );

      console.log('result', results);
      return results;
    } catch (error) {
      console.error('Error creating project role', error);
      throw error;
    }
  }

  async update(
    roleId: string,
    projectRole: UpdateProjectRoleDto,
  ): Promise<any> {
    try {
      console.log('data', projectRole);
      return await this.prisma.projectRole.update({
        where: { id: roleId },
        data: {
          title: projectRole.title,
          description: projectRole.description,
          isFilled: projectRole.isFilled,
          techStacks: {
            set: [],
            connect: projectRole.techStacks.map((tech) => ({ id: tech })),
          },
        },
        include: {
          techStacks: true,
        },
      });
    } catch (error) {
      console.error('Error updating project role', error);
      throw error;
    }
  }
}
