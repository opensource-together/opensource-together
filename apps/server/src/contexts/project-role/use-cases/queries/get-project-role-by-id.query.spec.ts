// /* eslint-disable @typescript-eslint/no-unsafe-assignment */
// /* eslint-disable @typescript-eslint/no-unsafe-call */
// /* eslint-disable @typescript-eslint/no-unsafe-member-access */
// /* eslint-disable @typescript-eslint/no-unsafe-argument */
// /* eslint-disable @typescript-eslint/no-unsafe-return */

// import { Test, TestingModule } from '@nestjs/testing';
// import {
//   GetProjectRoleByIdQuery,
//   GetProjectRoleByIdQueryHandler,
// } from './get-project-role-by-id.query';
// import { PROJECT_ROLE_REPOSITORY_PORT } from '../ports/project-role.repository.port';
// import { PROJECT_REPOSITORY_PORT } from '@/contexts/project/use-cases/ports/project.repository.port';
// import { InMemoryProjectRoleRepository } from '../../infrastructure/repositories/mock.project-role.repository';
// import { InMemoryProjectRepository } from '@/contexts/project/infrastructure/repositories/mock.project.repository';
// import { ProjectRole } from '../../domain/project-role.entity';
// import { TechStack } from '@/contexts/techstack/domain/techstack.entity';
// import { CLOCK_PORT, MockClock } from '@/libs/time';

// describe('GetProjectRoleByIdQueryHandler', () => {
//   let handler: GetProjectRoleByIdQueryHandler;
//   let projectRoleRepo: InMemoryProjectRoleRepository;
//   let projectRepo: InMemoryProjectRepository;
//   let reactTechStack: TechStack;
//   let typescriptTechStack: TechStack;
//   let mockClock: MockClock;

//   beforeEach(async () => {
//     mockClock = new MockClock(new Date('2024-01-01T10:00:00Z'));

//     const module: TestingModule = await Test.createTestingModule({
//       providers: [
//         GetProjectRoleByIdQueryHandler,
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

//     handler = module.get<GetProjectRoleByIdQueryHandler>(
//       GetProjectRoleByIdQueryHandler,
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
//     it('should return specific role by ID for existing project and role', async () => {
//       // Arrange
//       const query = new GetProjectRoleByIdQuery('123', 'role-1');

//       // Act
//       const result = await handler.execute(query);

//       // Assert
//       expect(result.success).toBe(true);
//       if (result.success) {
//         expect(result.value).toBeInstanceOf(ProjectRole);
//         expect(result.value.toPrimitive().id).toBe('role-1');
//         expect(result.value.toPrimitive().projectId).toBe('123');
//         expect(result.value.toPrimitive().roleTitle).toBe('Frontend Developer');
//         expect(result.value.toPrimitive().description).toBe(
//           'Responsible for UI development',
//         );
//         expect(result.value.toPrimitive().isFilled).toBe(false);
//       }
//     });

//     it('should return role with complete skill set', async () => {
//       // Arrange
//       const query = new GetProjectRoleByIdQuery('123', 'role-1');

//       // Act
//       const result = await handler.execute(query);

//       // Assert
//       expect(result.success).toBe(true);
//       if (result.success) {
//         const skillSet = result.value.toPrimitive().skillSet;
//         expect(skillSet).toHaveLength(2);

//         const skillNames = skillSet.map((skill) => skill.toPrimitive().name);
//         expect(skillNames).toContain('React');
//         expect(skillNames).toContain('TypeScript');

//         const skillUrls = skillSet.map((skill) => skill.toPrimitive().iconUrl);
//         expect(skillUrls).toContain('https://reactjs.org/favicon.ico');
//         expect(skillUrls).toContain('https://typescriptlang.org/favicon.ico');
//       }
//     });

//     it('should return role with timestamps', async () => {
//       // Arrange
//       const query = new GetProjectRoleByIdQuery('123', 'role-1');

//       // Act
//       const result = await handler.execute(query);

//       // Assert
//       expect(result.success).toBe(true);
//       if (result.success) {
//         const primitive = result.value.toPrimitive();
//         expect(primitive.createdAt).toBeDefined();
//         expect(primitive.updatedAt).toBeDefined();
//         expect(primitive.createdAt).toBeInstanceOf(Date);
//         expect(primitive.updatedAt).toBeInstanceOf(Date);
//       }
//     });

//     it('should return correct role when multiple roles exist in project', async () => {
//       // Arrange - Create additional roles
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
//         description: 'User interface design',
//         isFilled: false,
//         skillSet: [reactTechStack],
//       });

//       let backendRoleId: string = '';
//       if (backendRole.success && designerRole.success) {
//         const createdBackend = await projectRoleRepo.create(backendRole.value);
//         if (createdBackend.success) {
//           backendRoleId = createdBackend.value.toPrimitive().id!;
//         }
//         await projectRoleRepo.create(designerRole.value);
//       }

//       const query = new GetProjectRoleByIdQuery('123', backendRoleId);

//       // Act
//       const result = await handler.execute(query);

//       // Assert
//       expect(result.success).toBe(true);
//       if (result.success) {
//         expect(result.value.toPrimitive().roleTitle).toBe('Backend Developer');
//         expect(result.value.toPrimitive().description).toBe('API development');
//         expect(result.value.toPrimitive().isFilled).toBe(true);
//         expect(result.value.toPrimitive().skillSet).toHaveLength(1);
//         expect(result.value.toPrimitive().skillSet[0].toPrimitive().name).toBe(
//           'TypeScript',
//         );
//       }
//     });
//   });

//   describe('Failures', () => {
//     it('should fail if project does not exist', async () => {
//       // Arrange
//       const query = new GetProjectRoleByIdQuery(
//         'non-existent-project',
//         'role-1',
//       );

//       // Act
//       const result = await handler.execute(query);

//       // Assert
//       expect(result.success).toBe(false);
//       if (!result.success) {
//         expect(result.error).toBe('Project not found');
//       }
//     });

//     it('should fail if role does not exist in project', async () => {
//       // Arrange
//       const query = new GetProjectRoleByIdQuery('123', 'non-existent-role');

//       // Act
//       const result = await handler.execute(query);

//       // Assert
//       expect(result.success).toBe(false);
//       if (!result.success) {
//         expect(result.error).toBe('Project role not found');
//       }
//     });

//     it('should fail if role exists but in different project', async () => {
//       // Arrange - Create role in different project
//       const roleInDifferentProject = ProjectRole.create({
//         projectId: '456',
//         roleTitle: 'DevOps Engineer',
//         description: 'Infrastructure management',
//         isFilled: false,
//         skillSet: [typescriptTechStack],
//       });

//       let roleId: string = '';
//       if (roleInDifferentProject.success) {
//         const created = await projectRoleRepo.create(
//           roleInDifferentProject.value,
//         );
//         if (created.success) {
//           roleId = created.value.toPrimitive().id!;
//         }
//       }

//       // Try to fetch this role from project '123'
//       const query = new GetProjectRoleByIdQuery('123', roleId);

//       // Act
//       const result = await handler.execute(query);

//       // Assert
//       expect(result.success).toBe(false);
//       if (!result.success) {
//         expect(result.error).toBe('Project role not found');
//       }
//     });

//     it('should fail with empty role ID', async () => {
//       // Arrange
//       const query = new GetProjectRoleByIdQuery('123', '');

//       // Act
//       const result = await handler.execute(query);

//       // Assert
//       expect(result.success).toBe(false);
//       if (!result.success) {
//         expect(result.error).toBe('Project role not found');
//       }
//     });

//     it('should fail with whitespace-only role ID', async () => {
//       // Arrange
//       const query = new GetProjectRoleByIdQuery('123', '   ');

//       // Act
//       const result = await handler.execute(query);

//       // Assert
//       expect(result.success).toBe(false);
//       if (!result.success) {
//         expect(result.error).toBe('Project role not found');
//       }
//     });
//   });

//   describe('Edge Cases', () => {
//     it('should handle role ID with special characters', async () => {
//       // Arrange - Create role with special ID format
//       const specialRole = ProjectRole.create({
//         projectId: '123',
//         roleTitle: 'Special Role',
//         description: 'Role with special ID',
//         isFilled: false,
//         skillSet: [reactTechStack],
//       });

//       let specialRoleId: string = '';
//       if (specialRole.success) {
//         // Manually set a special ID in the mock repository
//         projectRoleRepo.addRole({
//           id: 'role-123-special',
//           projectId: '123',
//           roleTitle: 'Special Role',
//           description: 'Role with special ID',
//           isFilled: false,
//           skillSet: [
//             {
//               id: '1',
//               name: 'React',
//               iconUrl: 'https://reactjs.org/favicon.ico',
//             },
//           ],
//           createdAt: new Date(),
//           updatedAt: new Date(),
//         });
//         specialRoleId = 'role-123-special';
//       }

//       const query = new GetProjectRoleByIdQuery('123', specialRoleId);

//       // Act
//       const result = await handler.execute(query);

//       // Assert
//       expect(result.success).toBe(true);
//       if (result.success) {
//         expect(result.value.toPrimitive().id).toBe('role-123-special');
//         expect(result.value.toPrimitive().roleTitle).toBe('Special Role');
//       }
//     });

//     it('should be case-sensitive for role IDs', async () => {
//       // Arrange - Try to fetch with wrong case
//       const query = new GetProjectRoleByIdQuery('123', 'ROLE-1'); // uppercase

//       // Act
//       const result = await handler.execute(query);

//       // Assert
//       expect(result.success).toBe(false);
//       if (!result.success) {
//         expect(result.error).toBe('Project role not found');
//       }
//     });

//     it('should handle very long role IDs', async () => {
//       // Arrange
//       const longRoleId = 'role-' + 'a'.repeat(100);
//       const query = new GetProjectRoleByIdQuery('123', longRoleId);

//       // Act
//       const result = await handler.execute(query);

//       // Assert
//       expect(result.success).toBe(false);
//       if (!result.success) {
//         expect(result.error).toBe('Project role not found');
//       }
//     });
//   });

//   describe('Integration', () => {
//     it('should return the same role data as when created', async () => {
//       // Arrange - Create a new role and immediately fetch it
//       const newRole = ProjectRole.create({
//         projectId: '123',
//         roleTitle: 'Data Scientist',
//         description: 'Analyze data and build ML models',
//         isFilled: true,
//         skillSet: [reactTechStack, typescriptTechStack],
//       });

//       let roleId: string = '';
//       if (newRole.success) {
//         const created = await projectRoleRepo.create(newRole.value);
//         if (created.success) {
//           roleId = created.value.toPrimitive().id!;
//         }
//       }

//       const query = new GetProjectRoleByIdQuery('123', roleId);

//       // Act
//       const result = await handler.execute(query);

//       // Assert
//       expect(result.success).toBe(true);
//       if (result.success && newRole.success) {
//         const fetchedPrimitive = result.value.toPrimitive();
//         const originalPrimitive = newRole.value.toPrimitive();

//         expect(fetchedPrimitive.roleTitle).toBe(originalPrimitive.roleTitle);
//         expect(fetchedPrimitive.description).toBe(
//           originalPrimitive.description,
//         );
//         expect(fetchedPrimitive.isFilled).toBe(originalPrimitive.isFilled);
//         expect(fetchedPrimitive.projectId).toBe(originalPrimitive.projectId);
//         expect(fetchedPrimitive.skillSet).toHaveLength(
//           originalPrimitive.skillSet.length,
//         );
//       }
//     });

//     it('should be consistent across multiple calls', async () => {
//       // Arrange
//       const query = new GetProjectRoleByIdQuery('123', 'role-1');

//       // Act - Execute query multiple times
//       const result1 = await handler.execute(query);
//       const result2 = await handler.execute(query);
//       const result3 = await handler.execute(query);

//       // Assert
//       expect(result1.success).toBe(true);
//       expect(result2.success).toBe(true);
//       expect(result3.success).toBe(true);

//       if (result1.success && result2.success && result3.success) {
//         const primitive1 = result1.value.toPrimitive();
//         const primitive2 = result2.value.toPrimitive();
//         const primitive3 = result3.value.toPrimitive();

//         expect(primitive1.id).toBe(primitive2.id);
//         expect(primitive2.id).toBe(primitive3.id);
//         expect(primitive1.roleTitle).toBe(primitive2.roleTitle);
//         expect(primitive2.roleTitle).toBe(primitive3.roleTitle);
//         expect(primitive1.description).toBe(primitive2.description);
//         expect(primitive2.description).toBe(primitive3.description);
//       }
//     });
//   });
// });
