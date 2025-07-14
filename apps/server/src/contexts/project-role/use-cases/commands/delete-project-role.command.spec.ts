/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */

import { Test, TestingModule } from '@nestjs/testing';
import {
  DeleteProjectRoleCommand,
  DeleteProjectRoleCommandHandler,
} from './delete-project-role.command';
import { PROJECT_ROLE_REPOSITORY_PORT } from '../ports/project-role.repository.port';
import { PROJECT_REPOSITORY_PORT } from '@/contexts/project/use-cases/ports/project.repository.port';
import { InMemoryProjectRoleRepository } from '../../infrastructure/repositories/mock.project-role.repository';
import { InMemoryProjectRepository } from '@/contexts/project/infrastructure/repositories/mock.project.repository';
import { CLOCK_PORT, MockClock } from '@/libs/time';
import { ProjectRole } from '../../domain/project-role.entity';
import { TechStack } from '@/contexts/techstack/domain/techstack.entity';
import { InMemoryTechStackRepository } from '@/contexts/techstack/infrastructure/repositories/mock.techstack.repository';
import { TECHSTACK_REPOSITORY_PORT } from '@/contexts/techstack/use-cases/ports/techstack.repository.port';

describe('DeleteProjectRoleCommandHandler', () => {
  let handler: DeleteProjectRoleCommandHandler;
  let projectRoleRepo: InMemoryProjectRoleRepository;
  let projectRepo: InMemoryProjectRepository;
  let reactTechStack: TechStack;
  let mockClock: MockClock;
  let techStackRepo: InMemoryTechStackRepository;
  let existingProjectRole: ProjectRole;

  beforeEach(async () => {
    mockClock = new MockClock(new Date('2024-01-01T10:00:00Z'));

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeleteProjectRoleCommandHandler,
        {
          provide: PROJECT_ROLE_REPOSITORY_PORT,
          useFactory: () => new InMemoryProjectRoleRepository(mockClock),
        },
        {
          provide: PROJECT_REPOSITORY_PORT,
          useFactory: () => new InMemoryProjectRepository(mockClock),
        },
        {
          provide: TECHSTACK_REPOSITORY_PORT,
          useClass: InMemoryTechStackRepository,
        },
        {
          provide: CLOCK_PORT,
          useValue: mockClock,
        },
      ],
    }).compile();

    handler = module.get<DeleteProjectRoleCommandHandler>(
      DeleteProjectRoleCommandHandler,
    );
    projectRoleRepo = module.get<InMemoryProjectRoleRepository>(
      PROJECT_ROLE_REPOSITORY_PORT,
    );
    projectRepo = module.get<InMemoryProjectRepository>(
      PROJECT_REPOSITORY_PORT,
    );
    techStackRepo = module.get<InMemoryTechStackRepository>(
      TECHSTACK_REPOSITORY_PORT,
    );

    // Setup tech stack
    const react = TechStack.reconstitute({
      id: '1',
      name: 'React',
      iconUrl: 'https://reactjs.org/favicon.ico',
    });
    if (!react.success) {
      throw new Error('Failed to create tech stack');
    }

    const reactResult = await techStackRepo.create(react.value);
    if (reactResult.success) {
      reactTechStack = reactResult.value;
    }

    // Setup an existing project role
    const existingRoleData = ProjectRole.create({
      projectId: 'i39pYIlZKF',
      title: 'Frontend Developer',
      description: 'React developer',
      isFilled: false,
      techStacks: [reactTechStack.toPrimitive()],
    });
    if (existingRoleData.success) {
      const savedRole = await projectRoleRepo.create(existingRoleData.value);
      if (savedRole.success) {
        existingProjectRole = savedRole.value;
      }
    }
  });

  afterEach(() => {
    projectRoleRepo.reset();
    projectRepo.reset();
  });

  describe('Success', () => {
    it('should delete a project role successfully', async () => {
      // Arrange
      const command = new DeleteProjectRoleCommand(
        existingProjectRole.toPrimitive().id!,
        'i39pYIlZKF',
        '123',
      );

      // Act
      const result = await handler.execute(command);

      // Assert
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.value).toBe(true);
      }

      // Verify role is deleted
      const deletedRole = await projectRoleRepo.findById(
        existingProjectRole.toPrimitive().id!,
      );
      expect(deletedRole.success).toBe(false);
    });
  });

  describe('Failures', () => {
    it('should fail if project role does not exist', async () => {
      // Arrange
      const command = new DeleteProjectRoleCommand(
        'non-existent-role',
        'i39pYIlZKF',
        '123',
      );

      // Act
      const result = await handler.execute(command);

      // Assert
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe('Project role not found');
      }
    });

    it('should fail if project role does not belong to the specified project', async () => {
      // Arrange
      const command = new DeleteProjectRoleCommand(
        existingProjectRole.toPrimitive().id!,
        'different-project-id',
        '123',
      );

      // Act
      const result = await handler.execute(command);

      // Assert
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe(
          'Project role does not belong to this project',
        );
      }
    });

    it('should fail if project does not exist', async () => {
      // Arrange - Create a role with non-existent project ID
      const roleWithNonExistentProject = ProjectRole.create({
        projectId: 'non-existent-project',
        title: 'Test Role',
        description: 'Test description',
        isFilled: false,
        techStacks: [reactTechStack.toPrimitive()],
      });

      if (!roleWithNonExistentProject.success) {
        throw new Error('Failed to create role for test');
      }

      const savedRole = await projectRoleRepo.create(
        roleWithNonExistentProject.value,
      );
      if (!savedRole.success) {
        throw new Error('Failed to save role for test');
      }

      const command = new DeleteProjectRoleCommand(
        savedRole.value.toPrimitive().id!,
        'non-existent-project',
        '123',
      );

      // Act
      const result = await handler.execute(command);

      // Assert
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe('Project not found');
      }
    });

    it('should fail if user is not project owner', async () => {
      // Arrange
      const command = new DeleteProjectRoleCommand(
        existingProjectRole.toPrimitive().id!,
        'i39pYIlZKF',
        'user-456', // Different user
      );

      // Act
      const result = await handler.execute(command);

      // Assert
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe(
          'You are not allowed to delete roles in this project',
        );
      }
    });
  });
});
