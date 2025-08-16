import { Test, TestingModule } from '@nestjs/testing';
import {
  UpdateProjectRoleCommand,
  UpdateProjectRoleCommandHandler,
} from './update-project-role.command';
import { PROJECT_ROLE_REPOSITORY_PORT } from '../ports/project-role.repository.port';
import { PROJECT_REPOSITORY_PORT } from '@/contexts/project/use-cases/ports/project.repository.port';
import { InMemoryProjectRoleRepository } from '../../infrastructure/repositories/mock.project-role.repository';
import { InMemoryProjectRepository } from '@/contexts/project/infrastructure/repositories/mock.project.repository';
import { CLOCK_PORT, MockClock } from '@/libs/time';
import { ProjectRole } from '../../domain/project-role.entity';
import { TechStack } from '@/contexts/techstack/domain/techstack.entity';
import { InMemoryTechStackRepository } from '@/contexts/techstack/infrastructure/repositories/mock.techstack.repository';
import { TECHSTACK_REPOSITORY_PORT } from '@/contexts/techstack/use-cases/ports/techstack.repository.port';

describe('UpdateProjectRoleCommandHandler', () => {
  let handler: UpdateProjectRoleCommandHandler;
  let projectRoleRepo: InMemoryProjectRoleRepository;
  let projectRepo: InMemoryProjectRepository;
  let reactTechStack: TechStack;
  let typescriptTechStack: TechStack;
  let mockClock: MockClock;
  let techStackRepo: InMemoryTechStackRepository;
  let existingProjectRole: ProjectRole;

  beforeEach(async () => {
    mockClock = new MockClock(new Date('2024-01-01T10:00:00Z'));

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateProjectRoleCommandHandler,
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

    handler = module.get<UpdateProjectRoleCommandHandler>(
      UpdateProjectRoleCommandHandler,
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

    // Setup tech stacks
    const react = TechStack.reconstitute({
      id: '1',
      name: 'React',
      iconUrl: 'https://reactjs.org/favicon.ico',
      type: 'TECH',
    });
    const typescript = TechStack.reconstitute({
      id: '2',
      name: 'TypeScript',
      iconUrl: 'https://typescriptlang.org/favicon.ico',
      type: 'LANGUAGE',
    });
    if (!react.success || !typescript.success) {
      throw new Error('Failed to create tech stacks');
    }

    const reactResult = await techStackRepo.create(react.value);
    const typescriptResult = await techStackRepo.create(typescript.value);
    if (reactResult.success && typescriptResult.success) {
      reactTechStack = reactResult.value;
      typescriptTechStack = typescriptResult.value;
    }

    // Setup an existing project role
    const existingRoleData = ProjectRole.create({
      projectId: 'i39pYIlZKF',
      title: 'Frontend Developer',
      description: 'Original description',
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
    it('should update a project role successfully', async () => {
      // Arrange
      const command = new UpdateProjectRoleCommand(
        existingProjectRole.toPrimitive().id!,
        'i39pYIlZKF',
        '123',
        {
          title: 'Senior Frontend Developer',
          description: 'Updated description',
          techStacks: [typescriptTechStack.toPrimitive().id],
        },
      );

      // Act
      const result = await handler.execute(command);

      // Assert
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.value).toBeInstanceOf(ProjectRole);
        expect(result.value.toPrimitive().title).toBe(
          'Senior Frontend Developer',
        );
        expect(result.value.toPrimitive().description).toBe(
          'Updated description',
        );
        expect(result.value.toPrimitive().techStacks).toHaveLength(1);
        expect(result.value.toPrimitive().techStacks[0].id).toBe(
          typescriptTechStack.toPrimitive().id,
        );
      }
    });

    it('should update only the title', async () => {
      // Arrange
      const command = new UpdateProjectRoleCommand(
        existingProjectRole.toPrimitive().id!,
        'i39pYIlZKF',
        '123',
        {
          title: 'Backend Developer',
        },
      );

      // Act
      const result = await handler.execute(command);

      // Assert
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.value.toPrimitive().title).toBe('Backend Developer');
        expect(result.value.toPrimitive().description).toBe(
          'Original description',
        );
        expect(result.value.toPrimitive().techStacks).toHaveLength(1);
      }
    });

    it('should update only the description', async () => {
      // Arrange
      const command = new UpdateProjectRoleCommand(
        existingProjectRole.toPrimitive().id!,
        'i39pYIlZKF',
        '123',
        {
          description: 'New description',
        },
      );

      // Act
      const result = await handler.execute(command);

      // Assert
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.value.toPrimitive().title).toBe('Frontend Developer');
        expect(result.value.toPrimitive().description).toBe('New description');
      }
    });

    it('should update only the tech stacks', async () => {
      // Arrange
      const command = new UpdateProjectRoleCommand(
        existingProjectRole.toPrimitive().id!,
        'i39pYIlZKF',
        '123',
        {
          techStacks: [
            reactTechStack.toPrimitive().id,
            typescriptTechStack.toPrimitive().id,
          ],
        },
      );

      // Act
      const result = await handler.execute(command);

      // Assert
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.value.toPrimitive().techStacks).toHaveLength(2);
      }
    });
  });

  describe('Failures', () => {
    it('should fail if project role does not exist', async () => {
      // Arrange
      const command = new UpdateProjectRoleCommand(
        'non-existent-role',
        'i39pYIlZKF',
        '123',
        {
          title: 'Updated Title',
        },
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
      const command = new UpdateProjectRoleCommand(
        existingProjectRole.toPrimitive().id!,
        'different-project-id',
        '123',
        {
          title: 'Updated Title',
        },
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

      const command = new UpdateProjectRoleCommand(
        savedRole.value.toPrimitive().id!,
        'non-existent-project',
        '123',
        {
          title: 'Updated Title',
        },
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
        existingProjectRole.toPrimitive().id!,
        'i39pYIlZKF',
        'user-456', // Different user
        {
          title: 'Updated Title',
        },
      );

      // Act
      const result = await handler.execute(command);

      // Assert
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe(
          'You are not allowed to update roles in this project',
        );
      }
    });

    it('should fail if tech stack does not exist', async () => {
      // Arrange
      const command = new UpdateProjectRoleCommand(
        existingProjectRole.toPrimitive().id!,
        'i39pYIlZKF',
        '123',
        {
          techStacks: ['non-existent-tech-stack'],
        },
      );

      // Act
      const result = await handler.execute(command);

      // Assert
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(typeof result.error).toBe('string');
      }
    });

    it('should fail if updated title is empty', async () => {
      // Arrange
      const command = new UpdateProjectRoleCommand(
        existingProjectRole.toPrimitive().id!,
        'i39pYIlZKF',
        '123',
        {
          title: '',
        },
      );

      // Act
      const result = await handler.execute(command);

      // Assert
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toEqual({
          title: 'Role title is required',
        });
      }
    });

    it('should fail if updated description is empty', async () => {
      // Arrange
      const command = new UpdateProjectRoleCommand(
        existingProjectRole.toPrimitive().id!,
        'i39pYIlZKF',
        '123',
        {
          description: '',
        },
      );

      // Act
      const result = await handler.execute(command);

      // Assert
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toEqual({
          description: 'Description is required',
        });
      }
    });

    it('should fail if updated tech stacks is empty array', async () => {
      // Arrange
      const command = new UpdateProjectRoleCommand(
        existingProjectRole.toPrimitive().id!,
        'i39pYIlZKF',
        '123',
        {
          techStacks: [],
        },
      );

      // Act
      const result = await handler.execute(command);

      // Assert
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toEqual({
          techStacks: 'At least one tech stack is required',
        });
      }
    });

    it('should fail if updated title is too long', async () => {
      // Arrange
      const longTitle = 'a'.repeat(101); // 101 characters
      const command = new UpdateProjectRoleCommand(
        existingProjectRole.toPrimitive().id!,
        'i39pYIlZKF',
        '123',
        {
          title: longTitle,
        },
      );

      // Act
      const result = await handler.execute(command);

      // Assert
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toEqual({
          title: 'Role title must be less than 100 characters',
        });
      }
    });

    it('should fail if updated description is too long', async () => {
      // Arrange
      const longDescription = 'a'.repeat(501); // 501 characters
      const command = new UpdateProjectRoleCommand(
        existingProjectRole.toPrimitive().id!,
        'i39pYIlZKF',
        '123',
        {
          description: longDescription,
        },
      );

      // Act
      const result = await handler.execute(command);

      // Assert
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toEqual({
          description: 'Description must be less than 500 characters',
        });
      }
    });
  });
});
