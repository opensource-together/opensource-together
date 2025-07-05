// /* eslint-disable @typescript-eslint/no-unsafe-assignment */
// /* eslint-disable @typescript-eslint/no-unsafe-call */
// /* eslint-disable @typescript-eslint/no-unsafe-member-access */
// /* eslint-disable @typescript-eslint/no-unsafe-argument */
// /* eslint-disable @typescript-eslint/no-unsafe-return */

// import { Test, TestingModule } from '@nestjs/testing';
// import {
//   GetProjectRolesQuery,
//   GetProjectRolesQueryHandler,
// } from './get-project-roles.query';
// import { PROJECT_ROLE_REPOSITORY_PORT } from '../ports/project-role.repository.port';
// import { PROJECT_REPOSITORY_PORT } from '@/contexts/project/use-cases/ports/project.repository.port';
// import { InMemoryProjectRoleRepository } from '../../infrastructure/repositories/mock.project-role.repository';
// import { InMemoryProjectRepository } from '@/contexts/project/infrastructure/repositories/mock.project.repository';
// import { CLOCK_PORT, MockClock } from '@/libs/time';
// import { ProjectRole } from '../../domain/project-role.entity';
// import { TechStack } from '@/contexts/techstack/domain/techstack.entity';

// describe('GetProjectRolesQueryHandler', () => {
//   let handler: GetProjectRolesQueryHandler;
//   let projectRoleRepo: InMemoryProjectRoleRepository;
//   let projectRepo: InMemoryProjectRepository;
//   let reactTechStack: TechStack;
//   let typescriptTechStack: TechStack;
//   let mockClock: MockClock;

//   beforeEach(async () => {
//     mockClock = new MockClock(new Date('2024-01-01T10:00:00Z'));

//     const module: TestingModule = await Test.createTestingModule({
//       providers: [
//         GetProjectRolesQueryHandler,
//         {
//           provide: PROJECT_ROLE_REPOSITORY_PORT,
//           useClass: InMemoryProjectRoleRepository,
//         },
//         {
//           provide: PROJECT_REPOSITORY_PORT,
//           useClass: InMemoryProjectRepository,
//         },
//         {
//           provide: CLOCK_PORT,
//           useValue: mockClock,
//         },
//       ],
//     }).compile();

//     handler = module.get<GetProjectRolesQueryHandler>(
//       GetProjectRolesQueryHandler,
//     );
//     projectRoleRepo = module.get<InMemoryProjectRoleRepository>(
//       PROJECT_ROLE_REPOSITORY_PORT,
//     );
//     projectRepo = module.get<InMemoryProjectRepository>(
//       PROJECT_REPOSITORY_PORT,
//     );

//     // Setup tech stacks
//     const reactResult = TechStack.reconstitute({
//       id: '1',
//       name: 'React',
//       iconUrl: 'https://reactjs.org/favicon.ico',
//     });
//     const typescriptResult = TechStack.reconstitute({
//       id: '2',
//       name: 'TypeScript',
//       iconUrl: 'https://typescriptlang.org/favicon.ico',
//     });

//     if (reactResult.success && typescriptResult.success) {
//       reactTechStack = reactResult.value;
//       typescriptTechStack = typescriptResult.value;
//     }
//   });

//   afterEach(() => {
//     projectRoleRepo.reset();
//     projectRepo.reset();
//   });

//   describe('Success', () => {
//     it('should return all roles for an existing project', async () => {
//       // Arrange
//       const query = new GetProjectRolesQuery('123');

//       // Act
//       const result = await handler.execute(query);

//       // Assert
//       expect(result.success).toBe(true);
//       if (result.success) {
//         expect(result.value).toHaveLength(1);
//         expect(result.value[0]).toBeInstanceOf(ProjectRole);
//         expect(result.value[0].toPrimitive().projectId).toBe('123');
//         expect(result.value[0].toPrimitive().roleTitle).toBe(
//           'Frontend Developer',
//         );
//       }
//     });

//     it('should return empty array for project with no roles', async () => {
//       // Arrange - Empty project already exists with id '456' in the mock repository

//       const query = new GetProjectRolesQuery('456');

//       // Act
//       const result = await handler.execute(query);

//       // Assert
//       expect(result.success).toBe(true);
//       if (result.success) {
//         expect(result.value).toHaveLength(0);
//         expect(Array.isArray(result.value)).toBe(true);
//       }
//     });

//     it('should return multiple roles for project with multiple roles', async () => {
//       // Arrange - Add more roles to the existing project
//       const backendRole = ProjectRole.create({
//         projectId: '123',
//         roleTitle: 'Backend Developer',
//         description: 'API development',
//         isFilled: true,
//         skillSet: [typescriptTechStack],
//       });

//       const designerRole = ProjectRole.create({
//         projectId: '123',
//         roleTitle: 'UI/UX Designer',
//         description: 'User interface and experience design',
//         isFilled: false,
//         skillSet: [reactTechStack],
//       });

//       if (backendRole.success && designerRole.success) {
//         await projectRoleRepo.create(backendRole.value);
//         await projectRoleRepo.create(designerRole.value);
//       }

//       const query = new GetProjectRolesQuery('123');

//       // Act
//       const result = await handler.execute(query);

//       // Assert
//       expect(result.success).toBe(true);
//       if (result.success) {
//         expect(result.value).toHaveLength(3); // Original + 2 new roles

//         const roleTitles = result.value.map(
//           (role) => role.toPrimitive().roleTitle,
//         );
//         expect(roleTitles).toContain('Frontend Developer');
//         expect(roleTitles).toContain('Backend Developer');
//         expect(roleTitles).toContain('UI/UX Designer');

//         // Check specific role details
//         const backendRoleResult = result.value.find(
//           (role) => role.toPrimitive().roleTitle === 'Backend Developer',
//         );
//         expect(backendRoleResult?.toPrimitive().isFilled).toBe(true);

//         const designerRoleResult = result.value.find(
//           (role) => role.toPrimitive().roleTitle === 'UI/UX Designer',
//         );
//         expect(designerRoleResult?.toPrimitive().isFilled).toBe(false);
//       }
//     });

//     it('should return roles with correct skill sets', async () => {
//       // Arrange
//       const query = new GetProjectRolesQuery('123');

//       // Act
//       const result = await handler.execute(query);

//       // Assert
//       expect(result.success).toBe(true);
//       if (result.success) {
//         const frontendRole = result.value[0];
//         const skillSet = frontendRole.toPrimitive().skillSet;

//         expect(skillSet).toHaveLength(2);

//         const skillNames = skillSet.map((skill) => skill.toPrimitive().name);
//         expect(skillNames).toContain('React');
//         expect(skillNames).toContain('TypeScript');
//       }
//     });

//     it('should not return roles from other projects', async () => {
//       // Arrange - Create roles in different projects
//       const roleInProject456 = ProjectRole.create({
//         projectId: '456',
//         roleTitle: 'DevOps Engineer',
//         description: 'Infrastructure management',
//         isFilled: false,
//         skillSet: [typescriptTechStack],
//       });

//       if (roleInProject456.success) {
//         await projectRoleRepo.create(roleInProject456.value);
//       }

//       const query = new GetProjectRolesQuery('123');

//       // Act
//       const result = await handler.execute(query);

//       // Assert
//       expect(result.success).toBe(true);
//       if (result.success) {
//         expect(result.value).toHaveLength(1); // Only the original role from project 123
//         expect(result.value[0].toPrimitive().roleTitle).toBe(
//           'Frontend Developer',
//         );

//         // Verify DevOps role is not included
//         const devOpsRole = result.value.find(
//           (role) => role.toPrimitive().roleTitle === 'DevOps Engineer',
//         );
//         expect(devOpsRole).toBeUndefined();
//       }
//     });
//   });

//   describe('Failures', () => {
//     it('should fail if project does not exist', async () => {
//       // Arrange
//       const query = new GetProjectRolesQuery('non-existent-project');

//       // Act
//       const result = await handler.execute(query);

//       // Assert
//       expect(result.success).toBe(false);
//       if (!result.success) {
//         expect(result.error).toBe('Project not found');
//       }
//     });
//   });

//   describe('Edge Cases', () => {
//     it('should handle project ID with special characters', async () => {
//       // Arrange - Create project with special ID
//       projectAuth.addProject({
//         id: 'project-123-test',
//         ownerId: 'user-123',
//         title: 'Special Project',
//       });

//       const specialRole = ProjectRole.create({
//         projectId: 'project-123-test',
//         roleTitle: 'Special Role',
//         description: 'Role in special project',
//         isFilled: false,
//         skillSet: [reactTechStack],
//       });

//       if (specialRole.success) {
//         await projectRoleRepo.create(specialRole.value);
//       }

//       const query = new GetProjectRolesQuery('project-123-test');

//       // Act
//       const result = await handler.execute(query);

//       // Assert
//       expect(result.success).toBe(true);
//       if (result.success) {
//         expect(result.value).toHaveLength(1);
//         expect(result.value[0].toPrimitive().roleTitle).toBe('Special Role');
//       }
//     });

//     it('should return consistent results across multiple calls', async () => {
//       // Arrange
//       const query = new GetProjectRolesQuery('123');

//       // Act - Execute query multiple times
//       const result1 = await handler.execute(query);
//       const result2 = await handler.execute(query);
//       const result3 = await handler.execute(query);

//       // Assert
//       expect(result1.success).toBe(true);
//       expect(result2.success).toBe(true);
//       expect(result3.success).toBe(true);

//       if (result1.success && result2.success && result3.success) {
//         expect(result1.value).toHaveLength(result2.value.length);
//         expect(result2.value).toHaveLength(result3.value.length);

//         // Verify same role titles are returned
//         const titles1 = result1.value
//           .map((r) => r.toPrimitive().roleTitle)
//           .sort();
//         const titles2 = result2.value
//           .map((r) => r.toPrimitive().roleTitle)
//           .sort();
//         const titles3 = result3.value
//           .map((r) => r.toPrimitive().roleTitle)
//           .sort();

//         expect(titles1).toEqual(titles2);
//         expect(titles2).toEqual(titles3);
//       }
//     });
//   });

//   describe('Integration', () => {
//     it('should return roles in consistent order', async () => {
//       // Arrange - Create multiple roles
//       const roles = [
//         { title: 'Z Backend Developer', description: 'Last alphabetically' },
//         { title: 'A Frontend Developer', description: 'First alphabetically' },
//         { title: 'M Designer', description: 'Middle alphabetically' },
//       ];

//       for (const roleData of roles) {
//         const role = ProjectRole.create({
//           projectId: '123',
//           roleTitle: roleData.title,
//           description: roleData.description,
//           isFilled: false,
//           skillSet: [reactTechStack],
//         });

//         if (role.success) {
//           await projectRoleRepo.create(role.value);
//         }
//       }

//       const query = new GetProjectRolesQuery('123');

//       // Act
//       const result = await handler.execute(query);

//       // Assert
//       expect(result.success).toBe(true);
//       if (result.success) {
//         expect(result.value).toHaveLength(4); // 3 new + 1 original

//         // The order should be consistent across calls
//         const firstCallTitles = result.value.map(
//           (r) => r.toPrimitive().roleTitle,
//         );

//         const secondResult = await handler.execute(query);
//         if (secondResult.success) {
//           const secondCallTitles = secondResult.value.map(
//             (r) => r.toPrimitive().roleTitle,
//           );
//           expect(firstCallTitles).toEqual(secondCallTitles);
//         }
//       }
//     });
//   });
// });
