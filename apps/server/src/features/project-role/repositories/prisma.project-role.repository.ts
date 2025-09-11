import { Result } from '@/libs/result';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { UpdateProjectRoleDto } from '../controllers/dto/update-project-role.dto';
import { ProjectRole } from '../domain/project-role';
import {
  CreateProjectRoleDto,
  ProjectRoleRepository,
} from './project-role.repository.interface';

@Injectable()
export class PrismaProjectRoleRepository implements ProjectRoleRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getAll(projectId: string): Promise<Result<ProjectRole[], string>> {
    try {
      const projectRoles = await this.prisma.projectRole.findMany({
        where: { projectId },
        include: { techStacks: true },
      });
      if (!projectRoles) {
        return Result.fail('PROJECT_ROLE_NOT_FOUND');
      }
      return Result.ok(
        projectRoles.map((role) => ({
          id: role.id,
          projectId: role.projectId,
          title: role.title,
          description: role.description,
          isFilled: role.isFilled,
          techStacks: role.techStacks,
        })),
      );
    } catch (error) {
      console.error('Error getting all project roles', error);
      return Result.fail('DATABASE_ERROR');
    }
  }

  async create(
    projectId: string,
    projectRoles: CreateProjectRoleDto[],
  ): Promise<Result<ProjectRole[], string>> {
    try {
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
            include: {
              techStacks: true,
            },
          }),
        ),
      );
      if (!results) {
        return Result.fail('PROJECT_ROLE_NOT_FOUND');
      }
      return Result.ok(results);
    } catch (error) {
      console.error('Error creating project role', error);
      return Result.fail('DATABASE_ERROR');
    }
  }

  async update(
    roleId: string,
    projectRole: UpdateProjectRoleDto,
  ): Promise<Result<ProjectRole, string>> {
    try {
      const updatedProjectRole = await this.prisma.projectRole.update({
        where: { id: roleId },
        data: {
          title: projectRole.title,
          description: projectRole.description,
          techStacks: {
            set: [],
            connect: projectRole.techStacks.map((tech) => ({ id: tech })),
          },
        },
        include: {
          techStacks: true,
        },
      });
      if (!updatedProjectRole) {
        return Result.fail('PROJECT_ROLE_NOT_FOUND');
      }
      return Result.ok(updatedProjectRole);
    } catch (error) {
      console.error('Error updating project role', error);
      return Result.fail('DATABASE_ERROR');
    }
  }

  async findById(roleId: string): Promise<Result<ProjectRole, string>> {
    try {
      const projectRole = await this.prisma.projectRole.findUnique({
        where: { id: roleId },
        include: { techStacks: true },
      });
      if (!projectRole) {
        return Result.fail('PROJECT_ROLE_NOT_FOUND');
      }
      return Result.ok(projectRole);
    } catch (error) {
      console.error('Error finding project role by id', error);
      return Result.fail('DATABASE_ERROR');
    }
  }

  async delete(roleId: string): Promise<Result<void, string>> {
    try {
      await this.prisma.projectRole.delete({
        where: { id: roleId },
      });
      return Result.ok(undefined);
    } catch (error) {
      console.error('Error deleting project role', error);
      return Result.fail('DATABASE_ERROR');
    }
  }
}
