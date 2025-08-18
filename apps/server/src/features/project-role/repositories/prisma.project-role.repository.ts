import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { ProjectRoleRepository } from './project-role.repository.interface';
import { ProjectRole } from '../domain/project-role';

@Injectable()
export class PrismaProjectRoleRepository implements ProjectRoleRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: ProjectRole[]): Promise<any> {
    try {
      console.log('data', data);
      const result = await this.prisma.projectRole.createMany({
        data: data.map((role) => ({
          projectId: role.projectId,
          title: role.title,
          description: role.description,
          isFilled: role.isFilled || false,
          techStacks: {
            connect: role.techStacks.map((tech) => ({ id: tech.id })),
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
