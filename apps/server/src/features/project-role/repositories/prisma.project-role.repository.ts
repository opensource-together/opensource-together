import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import {
  CreateProjectRoleDto,
  ProjectRoleRepository,
} from './project-role.repository.interface';

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
}
