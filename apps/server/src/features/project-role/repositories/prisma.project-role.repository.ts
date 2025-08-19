import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import {
  CreateProjectRoleDto,
  ProjectRoleRepository,
} from './project-role.repository.interface';

@Injectable()
export class PrismaProjectRoleRepository implements ProjectRoleRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateProjectRoleDto[]): Promise<any> {
    try {
      console.log('data', data);
      const result = await this.prisma.projectRole.createMany({
        data: data.map((role) => ({
          projectId: role.projectId,
          title: role.title,
          description: role.description,
          isFilled: false,
          techStacks: {
            connect: role.techStacks.map((tech) => ({ id: tech })),
          },
        })),
      });
      console.log('result', result);
      //   return result.count;
    } catch (error) {
      console.error('Error creating project role', error);
      throw error;
    }
  }
}
