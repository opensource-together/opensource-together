import { Test, TestingModule } from '@nestjs/testing';
import {
  DeleteProjectRoleCommand,
  DeleteProjectRoleCommandHandler,
} from './delete-project-role.command';
import { PROJECT_ROLE_REPOSITORY_PORT } from '../ports/project-role.repository.port';
import { InMemoryProjectRoleRepository } from '../../infrastructure/repositories/mock.project-role.repository';
import { ProjectRole } from '../../domain/project-role.entity';
import { TechStack } from '@/domain/techStack/techstack.entity';
import { PROJECT_REPOSITORY_PORT } from '@/contexts/project/use-cases/ports/project.repository.port';
import { InMemoryProjectRepository } from '@/contexts/project/infrastructure/repositories/mock.project.repository';
import { CLOCK_PORT, ClockPort, MockClock } from '@/shared/time';
import { CreateProjectRoleCommand } from './create-project-role.command';

describe('DeleteProjectRoleCommandHandler', () => {
  let handler: DeleteProjectRoleCommandHandler;
  let projectRoleRepo: InMemoryProjectRoleRepository;
  //   let projectAuth: InMemoryProjectAuthorization;
  let reactTechStack: TechStack;
  const clockPort: ClockPort = new MockClock(new Date('2025-01-01'));
  let projectRepo: InMemoryProjectRepository = new InMemoryProjectRepository(
    clockPort,
  );

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeleteProjectRoleCommandHandler,
        {
          provide: PROJECT_ROLE_REPOSITORY_PORT,
          useClass: InMemoryProjectRoleRepository,
        },
        {
          provide: CLOCK_PORT,
          useClass: MockClock,
        },
        // {
        //   provide: PROJECT_AUTHORIZATION_PORT,
        //   useClass: InMemoryProjectAuthorization,
        // },
        {
          provide: PROJECT_REPOSITORY_PORT,
          useClass: InMemoryProjectRepository,
        },
      ],
    }).compile();

    handler = module.get<DeleteProjectRoleCommandHandler>(
      DeleteProjectRoleCommandHandler,
    );
    projectRoleRepo = module.get<InMemoryProjectRoleRepository>(
      PROJECT_ROLE_REPOSITORY_PORT,
    );
    // projectAuth = module.get<InMemoryProjectAuthorization>(
    //   PROJECT_AUTHORIZATION_PORT,
    // );
    projectRepo = module.get<InMemoryProjectRepository>(
      PROJECT_REPOSITORY_PORT,
    );

    // Setup tech stack
    const reactResult = TechStack.reconstitute({
      id: '1',
      name: 'React',
      iconUrl: 'https://reactjs.org/favicon.ico',
    });

    if (reactResult.success) {
      reactTechStack = reactResult.value;
    }
  });

  afterEach(() => {
    projectRoleRepo.reset();
    // projectAuth.reset();
    projectRepo.reset();
  });

  describe('Success', () => {
    it('should delete a project role successfully', async () => {
      // Arrange - Create a role
      const createResult = ProjectRole.create({
        projectId: 'i39pYIlZKF',
        roleTitle: 'Backend Developer',
        description: 'API development',
        isFilled: false,
        skillSet: [reactTechStack],
      });

      if (!createResult.success) {
        throw new Error(createResult.error as string);
      }

      const role = createResult.value;

      // Arrange
      const command = new DeleteProjectRoleCommand({
        projectId: 'i39pYIlZKF', // projectId
        roleId: role.toPrimitive().id!,
        userId: '123', // userId
      });

      // Verify role exists before deletion
      const roleBeforeResult = await projectRoleRepo.findByProjectIdAndRoleId(
        'i39pYIlZKF',
        role.toPrimitive().id!,
      );
      if (!roleBeforeResult.success) {
        throw new Error(roleBeforeResult.error);
      }
      expect(roleBeforeResult.success).toBe(true);

      // Act
      const result = await handler.execute(command);

      // Assert
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.value).toBe(true);
      }
    });

    it('should remove role from project role list', async () => {
      // Arrange
      // Create an additional role to test that only the target role is deleted
      const additionalRole = ProjectRole.create({
        projectId: 'i39pYIlZKF',
        roleTitle: 'Backend Developer',
        description: 'API development',
        isFilled: false,
        skillSet: [reactTechStack],
      });

      if (!additionalRole.success) {
        throw new Error(additionalRole.error as string);
      }

      const createResult = await projectRoleRepo.create(additionalRole.value);
      if (!createResult.success) {
        throw new Error(createResult.error);
      }

      const command = new DeleteProjectRoleCommand({
        projectId: 'i39pYIlZKF',
        roleId: 'role-2',
        userId: '123',
      });

      // Act
      const result = await handler.execute(command);

      // Assert
      if (!result.success) {
        throw new Error(result.error);
      }
      expect(result.success).toBe(true);

      // Verify the specific role is deleted
      const deletedRoleResult = await projectRoleRepo.findByProjectIdAndRoleId(
        '123',
        'role-1',
      );
      expect(deletedRoleResult.success).toBe(false);
      if (!deletedRoleResult.success) {
        expect(deletedRoleResult.error).toBe('Project role not found');
      }

      // Verify other roles in the project still exist
      const remainingRolesResult = await projectRoleRepo.findByProjectId('123');
      expect(remainingRolesResult.success).toBe(true);
      if (remainingRolesResult.success) {
        expect(remainingRolesResult.value).toHaveLength(1);
        expect(remainingRolesResult.value[0].toPrimitive().roleTitle).toBe(
          'Backend Developer',
        );
      }
    });
  });

  describe('Failures', () => {
    it('should fail if project does not exist', async () => {
      // Arrange
      const command = new DeleteProjectRoleCommand({
        projectId: 'non-existent-project',
        roleId: 'role-1',
        userId: '123',
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
      const command = new DeleteProjectRoleCommand({
        projectId: 'i39pYIlZKF',
        roleId: 'role-1',
        userId: '456', // Different user
      });

      // Act
      const result = await handler.execute(command);

      // Assert
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe(
          'You are not allowed to delete roles from this project',
        );
      }
    });

    it('should fail if role does not exist in project', async () => {
      // Arrange
      const command = new DeleteProjectRoleCommand({
        projectId: 'i39pYIlZKF',
        roleId: 'non-existent-role',
        userId: '123',
      });

      // Act
      const result = await handler.execute(command);

      // Assert
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe('Project role not found');
      }
    });

    it('should fail if role exists but not in the specified project', async () => {
      // Arrange - Create a role in a different project
      const roleInDifferentProject = ProjectRole.create({
        projectId: '456', // Different project
        roleTitle: 'Another Role',
        description: 'Role in different project',
        isFilled: false,
        skillSet: [reactTechStack],
      });

      if (roleInDifferentProject.success) {
        await projectRoleRepo.create(roleInDifferentProject.value);
      }

      // Try to delete this role from project '123'
      const roleId = roleInDifferentProject.success
        ? roleInDifferentProject.value.toPrimitive().id
        : 'some-id';

      const command = new DeleteProjectRoleCommand({
        projectId: 'i39pYIlZKF', // Wrong project
        roleId: roleId!,
        userId: '123',
      });

      // Act
      const result = await handler.execute(command);

      // Assert
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe('Project role not found');
      }
    });
  });

  describe('Edge Cases', () => {
    it('should handle deletion of role that was already deleted', async () => {
      // Arrange - Create a role

      // Arrange - Delete the role first
      const firstDeleteCommand = new DeleteProjectRoleCommand({
        projectId: 'i39pYIlZKF',
        roleId: 'role-1',
        userId: '123',
      });
      const firstResult = await handler.execute(firstDeleteCommand);
      if (!firstResult.success) {
        throw new Error(firstResult.error);
      }
      expect(firstResult.success).toBe(true);

      // Try to delete again
      const secondDeleteCommand = new DeleteProjectRoleCommand({
        projectId: 'i39pYIlZKF',
        roleId: 'role-1',
        userId: '123',
      });

      // Act
      const result = await handler.execute(secondDeleteCommand);

      // Assert
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe('Project role not found');
      }
    });

    it('should allow deletion of all roles in a project', async () => {
      // Arrange - Create multiple roles
      const role2 = ProjectRole.create({
        projectId: 'i39pYIlZKF',
        roleTitle: 'Backend Developer',
        description: 'API development',
        isFilled: false,
        skillSet: [reactTechStack],
      });

      const role3 = ProjectRole.create({
        projectId: 'i39pYIlZKF',
        roleTitle: 'Designer',
        description: 'UI/UX design',
        isFilled: false,
        skillSet: [reactTechStack],
      });

      if (role2.success && role3.success) {
        await projectRoleRepo.create(role2.value);
        await projectRoleRepo.create(role3.value);
      }

      // Get all role IDs
      const allRolesResult =
        await projectRoleRepo.findByProjectId('i39pYIlZKF');
      expect(allRolesResult.success).toBe(true);

      if (allRolesResult.success) {
        // Act - Delete all roles one by one
        for (const role of allRolesResult.value) {
          const deleteCommand = new DeleteProjectRoleCommand({
            projectId: 'i39pYIlZKF',
            roleId: role.toPrimitive().id!,
            userId: '123',
          });
          const deleteResult = await handler.execute(deleteCommand);
          expect(deleteResult.success).toBe(true);
        }

        // Assert - No roles should remain
        const finalRolesResult =
          await projectRoleRepo.findByProjectId('i39pYIlZKF');
        if (!finalRolesResult.success) {
          throw new Error(finalRolesResult.error);
        }
        expect(finalRolesResult.value).toHaveLength(0);
      }
    });
  });

  //   describe('Integration', () => {
  //     it('should permanently remove role from repository', async () => {
  //       // Arrange
  //       const command = new DeleteProjectRoleCommand('123', 'role-1', 'user-123');

  //       // Act
  //       const result = await handler.execute(command);

  //       // Assert
  //       expect(result.success).toBe(true);

  //       // Verify role cannot be found by any repository method
  //       const findByIdResult = await projectRoleRepo.findById('role-1');
  //       expect(findByIdResult.success).toBe(false);

  //       const findByProjectIdResult =
  //         await projectRoleRepo.findByProjectId('123');
  //       expect(findByProjectIdResult.success).toBe(true);
  //       if (findByProjectIdResult.success) {
  //         const foundRole = findByProjectIdResult.value.find(
  //           (role) => role.toPrimitive().id === 'role-1',
  //         );
  //         expect(foundRole).toBeUndefined();
  //       }

  //       const findByProjectIdAndRoleIdResult =
  //         await projectRoleRepo.findByProjectIdAndRoleId('123', 'role-1');
  //       expect(findByProjectIdAndRoleIdResult.success).toBe(false);
  //     });
  //   });
});
