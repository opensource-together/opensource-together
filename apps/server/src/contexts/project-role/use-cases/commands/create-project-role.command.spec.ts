/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */

import { Test, TestingModule } from '@nestjs/testing';
import {
  CreateProjectRoleCommand,
  CreateProjectRoleCommandHandler,
} from './create-project-role.command';
import { PROJECT_ROLE_REPOSITORY_PORT } from '../ports/project-role.repository.port';
import { PROJECT_REPOSITORY_PORT } from '@/contexts/project/use-cases/ports/project.repository.port';
import { InMemoryProjectRoleRepository } from '../../infrastructure/repositories/mock.project-role.repository';
import { InMemoryProjectRepository } from '@/contexts/project/infrastructure/repositories/mock.project.repository';
import { CLOCK_PORT, MockClock } from '@/libs/time';
import { ProjectRole } from '../../domain/project-role.entity';
import { TechStack } from '@/domain/techStack/techstack.entity';

describe('CreateProjectRoleCommandHandler', () => {
  let handler: CreateProjectRoleCommandHandler;
  let projectRoleRepo: InMemoryProjectRoleRepository;
  let projectRepo: InMemoryProjectRepository;
  let reactTechStack: TechStack;
  let typescriptTechStack: TechStack;
  let mockClock: MockClock;

  beforeEach(async () => {
    mockClock = new MockClock(new Date('2024-01-01T10:00:00Z'));

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateProjectRoleCommandHandler,
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

    handler = module.get<CreateProjectRoleCommandHandler>(
      CreateProjectRoleCommandHandler,
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

    if (reactResult.success && typescriptResult.success) {
      reactTechStack = reactResult.value;
      typescriptTechStack = typescriptResult.value;
    }
  });

  afterEach(() => {
    projectRoleRepo.reset();
    projectRepo.reset();
  });

  describe('Success', () => {
    it('should create a project role successfully', async () => {
      // Arrange
      const command = new CreateProjectRoleCommand({
        projectId: 'i39pYIlZKF',
        userId: '123',
        roleTitle: 'Backend Developer',
        description: 'Responsible for API development',
        isFilled: false,
        skillSet: [reactTechStack, typescriptTechStack],
      });

      // Act
      const result = await handler.execute(command);

      // Assert
      if (!result.success) {
        throw new Error(result.error);
      }
      expect(result.success).toBe(true);
      expect(result.value).toBeInstanceOf(ProjectRole);
      expect(result.value.toPrimitive().projectId).toBe('i39pYIlZKF');
      expect(result.value.toPrimitive().roleTitle).toBe('Backend Developer');
      expect(result.value.toPrimitive().description).toBe(
        'Responsible for API development',
      );
      expect(result.value.toPrimitive().isFilled).toBe(false);
      expect(result.value.toPrimitive().skillSet).toHaveLength(2);
      expect(result.value.toPrimitive().id).toBeDefined();
    });

    it('should create a project role with single skill', async () => {
      // Arrange
      const command = new CreateProjectRoleCommand({
        projectId: 'i39pYIlZKF',
        userId: '123',
        roleTitle: 'Designer',
        description: 'UI/UX Designer role',
        isFilled: true,
        skillSet: [reactTechStack],
      });

      // Act
      const result = await handler.execute(command);

      // Assert
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.value.toPrimitive().skillSet).toHaveLength(1);
        expect(result.value.toPrimitive().isFilled).toBe(true);
      }
    });
  });

  describe('Failures', () => {
    it('should fail if project does not exist', async () => {
      // Arrange
      const command = new CreateProjectRoleCommand({
        projectId: 'non-existent-project',
        userId: '123',
        roleTitle: 'Backend Developer',
        description: 'Responsible for API development',
        isFilled: false,
        skillSet: [reactTechStack],
      });

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
      const command = new CreateProjectRoleCommand({
        projectId: 'i39pYIlZKF',
        userId: 'user-456', // Different user
        roleTitle: 'Backend Developer',
        description: 'Responsible for API development',
        isFilled: false,
        skillSet: [reactTechStack],
      });

      // Act
      const result = await handler.execute(command);

      // Assert
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe(
          'You are not allowed to add roles to this project',
        );
      }
    });

    it('should fail if role with same title already exists in project', async () => {
      // Arrange - Role with title "Frontend Developer" already exists in project 123
      const command = new CreateProjectRoleCommand({
        projectId: 'i39pYIlZKF',
        userId: '123',
        roleTitle: 'Frontend Developer', // Same title as existing role
        description: 'Another frontend role',
        isFilled: false,
        skillSet: [reactTechStack],
      });

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

    it('should fail if role title is empty', async () => {
      // Arrange
      const command = new CreateProjectRoleCommand({
        projectId: 'i39pYIlZKF',
        userId: '123',
        roleTitle: '', // Empty title
        description: 'Valid description',
        isFilled: false,
        skillSet: [reactTechStack],
      });

      // Act
      const result = await handler.execute(command);

      // Assert
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toContain('Role title is required');
      }
    });

    it('should fail if description is empty', async () => {
      // Arrange
      const command = new CreateProjectRoleCommand({
        projectId: 'i39pYIlZKF',
        userId: '123',
        roleTitle: 'Valid Title',
        description: '', // Empty description
        isFilled: false,
        skillSet: [reactTechStack],
      });

      // Act
      const result = await handler.execute(command);

      // Assert
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toContain('Description is required');
      }
    });

    it('should fail if skillSet is empty', async () => {
      // Arrange
      const command = new CreateProjectRoleCommand({
        projectId: 'i39pYIlZKF',
        userId: '123',
        roleTitle: 'Valid Title',
        description: 'Valid description',
        isFilled: false,
        skillSet: [], // Empty skillSet
      });

      // Act
      const result = await handler.execute(command);

      // Assert
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toContain('At least one skill is required');
      }
    });

    it('should fail if role title is too long', async () => {
      // Arrange
      const longTitle = 'a'.repeat(101); // 101 characters
      const command = new CreateProjectRoleCommand({
        projectId: 'i39pYIlZKF',
        userId: '123',
        roleTitle: longTitle,
        description: 'Valid description',
        isFilled: false,
        skillSet: [reactTechStack],
      });

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

    it('should fail if description is too long', async () => {
      // Arrange
      const longDescription = 'a'.repeat(501); // 501 characters
      const command = new CreateProjectRoleCommand({
        projectId: 'i39pYIlZKF',
        userId: '123',
        roleTitle: 'Valid Title',
        description: longDescription,
        isFilled: false,
        skillSet: [reactTechStack],
      });

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

  //   describe('Integration', () => {
  //     it('should persist the created role in repository', async () => {
  //       // Arrange
  //       const command = new CreateProjectRoleCommand({
  //         projectId: 'i39pYIlZKF',
  //         userId: '123',
  //         roleTitle: 'DevOps Engineer',
  //         description: 'Manages infrastructure and deployments',
  //         isFilled: false,
  //         skillSet: [typescriptTechStack],
  //       });

  //       // Act
  //       const result = await handler.execute(command);

  //       // Assert
  //       expect(result.success).toBe(true);
  //       if (result.success) {
  //         // Verify role is persisted by trying to fetch all roles for the project
  //         const allRolesResult = await projectRoleRepo.findByProjectId('123');
  //         expect(allRolesResult.success).toBe(true);
  //         if (allRolesResult.success) {
  //           const devOpsRole = allRolesResult.value.find(
  //             (role) => role.toPrimitive().roleTitle === 'DevOps Engineer',
  //           );
  //           expect(devOpsRole).toBeDefined();
  //           expect(devOpsRole?.toPrimitive().description).toBe(
  //             'Manages infrastructure and deployments',
  //           );
  //         }
  //       }
  //     });
  //   });
});
