/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */

import { Test, TestingModule } from '@nestjs/testing';
import { UpdateProjectRoleCommandHandler } from './update-project-role.command';
import { PROJECT_ROLE_REPOSITORY_PORT } from '../ports/project-role.repository.port';
import { PROJECT_REPOSITORY_PORT } from '@/contexts/project/use-cases/ports/project.repository.port';
import { InMemoryProjectRoleRepository } from '../../infrastructure/repositories/mock.project-role.repository';
import { InMemoryProjectRepository } from '@/contexts/project/infrastructure/repositories/mock.project.repository';
import { CLOCK_PORT, MockClock } from '@/libs/time';
import { ProjectRole } from '../../domain/project-role.entity';
import { UpdateProjectRoleCommand } from './update-project-role.command';
import { TechStack } from '@/contexts/techstack/domain/techstack.entity';

describe('UpdateProjectRoleCommandHandler', () => {
  let handler: UpdateProjectRoleCommandHandler;
  let projectRoleRepo: InMemoryProjectRoleRepository;
  let projectRepo: InMemoryProjectRepository;
  let mockClock: MockClock;
  let reactTechStack: TechStack;

  let nodejsTechStack: TechStack;

  beforeEach(async () => {
    mockClock = new MockClock(new Date('2024-01-01T10:00:00Z'));

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateProjectRoleCommandHandler,
        {
          provide: PROJECT_ROLE_REPOSITORY_PORT,
          useClass: InMemoryProjectRoleRepository,
        },
        {
          provide: PROJECT_REPOSITORY_PORT,
          useClass: InMemoryProjectRepository,
        },
        {
          provide: CLOCK_PORT,
          useValue: mockClock,
        },
      ],
    }).compile();

    handler = module.get<UpdateProjectRoleCommandHandler>(
      UpdateProjectRoleCommandHandler,
    );
    projectRoleRepo = module.get<InMemoryProjectRoleRepository>(
      PROJECT_ROLE_REPOSITORY_PORT,
    );
    projectRepo = module.get<InMemoryProjectRepository>(
      PROJECT_REPOSITORY_PORT,
    );

    // Setup tech stacks
    const reactResult = TechStack.reconstitute({
      id: '1',
      name: 'React',
      iconUrl: 'https://reactjs.org/favicon.ico',
    });
    const typescriptResult = TechStack.reconstitute({
      id: '2',
      name: 'TypeScript',
      iconUrl: 'https://typescriptlang.org/favicon.ico',
    });
    const nodejsResult = TechStack.reconstitute({
      id: '3',
      name: 'Node.js',
      iconUrl: 'https://nodejs.org/favicon.ico',
    });

    if (
      reactResult.success &&
      typescriptResult.success &&
      nodejsResult.success
    ) {
      reactTechStack = reactResult.value;
      typescriptTechStack = typescriptResult.value;
      nodejsTechStack = nodejsResult.value;
    }
  });

  afterEach(() => {
    projectRoleRepo.reset();
    projectRepo.reset();
  });

  describe('Success', () => {
    it('should update role title successfully', async () => {
      // Arrange
      const command = new UpdateProjectRoleCommand(
        '123', // projectId
        'role-1', // roleId (existing role)
        'user-123', // userId
        { roleTitle: 'Senior Frontend Developer' },
      );

      // Act
      const result = await handler.execute(command);

      // Assert
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.value).toBeInstanceOf(ProjectRole);
        expect(result.value.toPrimitive().roleTitle).toBe(
          'Senior Frontend Developer',
        );
        expect(result.value.toPrimitive().description).toBe(
          'Responsible for UI development',
        ); // Should remain unchanged
      }
    });

    it('should update description successfully', async () => {
      // Arrange
      const command = new UpdateProjectRoleCommand(
        '123',
        'role-1',
        'user-123',
        { description: 'Updated description for frontend role' },
      );

      // Act
      const result = await handler.execute(command);

      // Assert
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.value.toPrimitive().description).toBe(
          'Updated description for frontend role',
        );
        expect(result.value.toPrimitive().roleTitle).toBe('Frontend Developer'); // Should remain unchanged
      }
    });

    it('should update isFilled status successfully', async () => {
      // Arrange
      const command = new UpdateProjectRoleCommand(
        '123',
        'role-1',
        'user-123',
        { isFilled: true },
      );

      // Act
      const result = await handler.execute(command);

      // Assert
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.value.toPrimitive().isFilled).toBe(true);
      }
    });

    it('should update skillSet successfully', async () => {
      // Arrange
      const command = new UpdateProjectRoleCommand(
        '123',
        'role-1',
        'user-123',
        { skillSet: [nodejsTechStack] },
      );

      // Act
      const result = await handler.execute(command);

      // Assert
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.value.toPrimitive().skillSet).toHaveLength(1);
        expect(result.value.toPrimitive().skillSet[0].toPrimitive().name).toBe(
          'Node.js',
        );
      }
    });

    it('should update multiple fields simultaneously', async () => {
      // Arrange
      const command = new UpdateProjectRoleCommand(
        '123',
        'role-1',
        'user-123',
        {
          roleTitle: 'Full Stack Developer',
          description: 'Works on both frontend and backend',
          isFilled: true,
          skillSet: [reactTechStack, nodejsTechStack],
        },
      );

      // Act
      const result = await handler.execute(command);

      // Assert
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.value.toPrimitive().roleTitle).toBe(
          'Full Stack Developer',
        );
        expect(result.value.toPrimitive().description).toBe(
          'Works on both frontend and backend',
        );
        expect(result.value.toPrimitive().isFilled).toBe(true);
        expect(result.value.toPrimitive().skillSet).toHaveLength(2);
      }
    });
  });

  describe('Failures', () => {
    it('should fail if project does not exist', async () => {
      // Arrange
      const command = new UpdateProjectRoleCommand(
        'non-existent-project',
        'role-1',
        'user-123',
        { roleTitle: 'Updated Title' },
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
      const command = new UpdateProjectRoleCommand(
        '123',
        'role-1',
        'user-456', // Different user
        { roleTitle: 'Updated Title' },
      );

      // Act
      const result = await handler.execute(command);

      // Assert
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe(
          'You are not allowed to update this project role',
        );
      }
    });

    it('should fail if role does not exist in project', async () => {
      // Arrange
      const command = new UpdateProjectRoleCommand(
        '123',
        'non-existent-role',
        'user-123',
        { roleTitle: 'Updated Title' },
      );

      // Act
      const result = await handler.execute(command);

      // Assert
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe('Project role not found');
      }
    });

    it('should fail if updated role title already exists in project', async () => {
      // Arrange - Create another role in the project first
      const anotherRole = ProjectRole.create({
        projectId: '123',
        roleTitle: 'Backend Developer',
        description: 'API development',
        isFilled: false,
        skillSet: [nodejsTechStack],
      });

      if (anotherRole.success) {
        await projectRoleRepo.create(anotherRole.value);
      }

      const command = new UpdateProjectRoleCommand(
        '123',
        'role-1',
        'user-123',
        { roleTitle: 'Backend Developer' }, // Same title as the other role
      );

      // Act
      const result = await handler.execute(command);

      // Assert
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe(
          'A role with this title already exists in this project',
        );
      }
    });

    it('should fail if updated role title is empty', async () => {
      // Arrange
      const command = new UpdateProjectRoleCommand(
        '123',
        'role-1',
        'user-123',
        { roleTitle: '' },
      );

      // Act
      const result = await handler.execute(command);

      // Assert
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toContain('Role title is required');
      }
    });

    it('should fail if updated description is empty', async () => {
      // Arrange
      const command = new UpdateProjectRoleCommand(
        '123',
        'role-1',
        'user-123',
        { description: '' },
      );

      // Act
      const result = await handler.execute(command);

      // Assert
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toContain('Description is required');
      }
    });

    it('should fail if updated skillSet is empty', async () => {
      // Arrange
      const command = new UpdateProjectRoleCommand(
        '123',
        'role-1',
        'user-123',
        { skillSet: [] },
      );

      // Act
      const result = await handler.execute(command);

      // Assert
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toContain('At least one skill is required');
      }
    });

    it('should fail if updated role title is too long', async () => {
      // Arrange
      const longTitle = 'a'.repeat(101);
      const command = new UpdateProjectRoleCommand(
        '123',
        'role-1',
        'user-123',
        { roleTitle: longTitle },
      );

      // Act
      const result = await handler.execute(command);

      // Assert
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toContain(
          'Role title must be less than 100 characters',
        );
      }
    });

    it('should fail if updated description is too long', async () => {
      // Arrange
      const longDescription = 'a'.repeat(501);
      const command = new UpdateProjectRoleCommand(
        '123',
        'role-1',
        'user-123',
        { description: longDescription },
      );

      // Act
      const result = await handler.execute(command);

      // Assert
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toContain(
          'Description must be less than 500 characters',
        );
      }
    });
  });

  describe('Edge Cases', () => {
    it('should allow updating role title to same value', async () => {
      // Arrange
      const command = new UpdateProjectRoleCommand(
        '123',
        'role-1',
        'user-123',
        { roleTitle: 'Frontend Developer' }, // Same title as current
      );

      // Act
      const result = await handler.execute(command);

      // Assert
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.value.toPrimitive().roleTitle).toBe('Frontend Developer');
      }
    });

    it('should handle empty update props gracefully', async () => {
      // Arrange
      const command = new UpdateProjectRoleCommand(
        '123',
        'role-1',
        'user-123',
        {}, // No fields to update
      );

      // Act
      const result = await handler.execute(command);

      // Assert
      expect(result.success).toBe(true);
      if (result.success) {
        // Role should remain unchanged
        expect(result.value.toPrimitive().roleTitle).toBe('Frontend Developer');
        expect(result.value.toPrimitive().description).toBe(
          'Responsible for UI development',
        );
      }
    });
  });

  describe('Integration', () => {
    it('should persist updated role in repository', async () => {
      // Arrange
      const command = new UpdateProjectRoleCommand(
        '123',
        'role-1',
        'user-123',
        { roleTitle: 'Senior Frontend Developer' },
      );

      // Act
      const result = await handler.execute(command);

      // Assert
      expect(result.success).toBe(true);
      if (result.success) {
        // Verify the update is persisted by fetching the role again
        const fetchedRoleResult =
          await projectRoleRepo.findByProjectIdAndRoleId('123', 'role-1');
        expect(fetchedRoleResult.success).toBe(true);
        if (fetchedRoleResult.success) {
          expect(fetchedRoleResult.value.toPrimitive().roleTitle).toBe(
            'Senior Frontend Developer',
          );
        }
      }
    });
  });
});
