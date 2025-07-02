import { Result } from '@/shared/result';
import { TechStack } from '@/domain/techStack/techstack.entity';
import {
  Project,
  ProjectCreateProps,
  ProjectValidationErrors,
} from './project.entity';
import { User } from '@/contexts/user/domain/user.entity';
import { ProjectRole } from '@/contexts/project-role/domain/project-role.entity';

describe('Domain Project Entity', () => {
  describe('create', () => {
    it('should create a project with valid properties', () => {
      const props = getProjectProps();
      const projectResult = Project.create(props);
      if (projectResult.success) {
        expect(projectResult.value).toBeInstanceOf(Project);
      } else {
        throw new Error('Project should be created');
      }
    });

    // Parameterized test for validation errors
    it.each([
      //title
      ['title', '', { title: 'Title is required' }],
      ['title', '   ', { title: 'Title is required' }],
      [
        'title',
        'a'.repeat(101),
        { title: 'Title must be less than 100 characters' },
      ],
      //shortDescription
      [
        'shortDescription',
        '',
        { shortDescription: 'Short description is required' },
      ],
      [
        'shortDescription',
        '   ',
        { shortDescription: 'Short description is required' },
      ],
      [
        'shortDescription',
        'a'.repeat(101),
        {
          shortDescription:
            'Short description must be less than 100 characters',
        },
      ],
      //description
      ['description', '', { description: 'Description is required' }],
      [
        'description',
        'a'.repeat(1001),
        { description: 'Description must be less than 1000 characters' },
      ],
      //techStacks
      ['techStacks', [], { techStacks: 'Tech stacks are required' }],
      [
        'techStacks',
        [{ name: 'Invalid', iconUrl: 'url' }], // Simulating invalid reconstituted TechStack
        { techStacks: 'Tech stacks are not valid' },
      ],
      //collaborators
      // [
      //   'collaborators',
      //   [{ userId: '', role: 'developer' }],
      //   {
      //     collaborators: 'User id for collaborators is required',
      //   },
      // ],
      // [
      //   'collaborators',
      //   [{ userId: '1', role: '' }],
      //   {
      //     collaborators: 'Role for collaborators is required',
      //   },
      // ],
      // //keyFeatures
      // [
      //   'keyFeatures',
      //   [],
      //   { keyFeatures: 'Key features required at least one' },
      // ],
      // [
      //   'keyFeatures',
      //   [{ keyFeature: 'a'.repeat(101) }],
      //   {
      //     keyFeatures: 'Key features must be less than 100 characters',
      //   },
      // ],
      // //projectGoals
      // ['projectGoals', [], { projectGoals: 'Project goals are required' }],
      // [
      //   'projectGoals',
      //   [],
      //   { projectGoals: 'Project goals required at least one' },
      // ],
      // [
      //   'projectGoals',
      //   [{ projectGoal: 'a'.repeat(101) }],
      //   {
      //     projectGoals: 'Project goals must be less than 100 characters',
      //   },
      // ],
    ])(
      'should fail validation if %s is invalid with value: %j',
      (field, value, expectedError) => {
        const props = getProjectProps({ [field]: value });
        // props[field as keyof ProjectCreateProps] = value as any;
        const projectResult: Result<Project, ProjectValidationErrors | string> =
          Project.create(props);

        if (projectResult.success) {
          throw new Error(
            `Project creation should have failed for field '${field}' but succeeded. Test case value: ${JSON.stringify(
              value,
            )}`,
          );
        } else {
          expect(projectResult.error).toEqual(expectedError);
        }
      },
    );
  });

  describe('reconstitute', () => {
    it('should fail if createdAt is after updatedAt', () => {
      const props = getProjectProps({
        id: '123',
        createdAt: new Date(Date.now() + 1000),
        updatedAt: new Date(),
      });
      const reconstitute: Result<Project, ProjectValidationErrors | string> =
        Project.reconstitute(props);
      if (reconstitute.success) {
        throw new Error('Project reconstitution should have failed');
      }
      expect(reconstitute.error).toBe('createdAt must be before updatedAt');
    });

    it('should fail if createdAt is not provided', () => {
      const props = getProjectProps({
        id: '123',
        createdAt: undefined,
        updatedAt: new Date(),
      });
      const reconstitute: Result<Project, ProjectValidationErrors | string> =
        Project.reconstitute(props);
      if (reconstitute.success) {
        throw new Error('Project reconstitution should have failed');
      }
      expect(reconstitute.error).toBe('createdAt and updatedAt are required');
    });
    it('should fail if updatedAt is not provided', () => {
      const props = getProjectProps({
        id: '123',
        createdAt: new Date(),
        updatedAt: undefined,
      });
      const reconstitute: Result<Project, ProjectValidationErrors | string> =
        Project.reconstitute(props);
      if (reconstitute.success) {
        throw new Error('Project reconstitution should have failed');
      }
      expect(reconstitute.error).toBe('createdAt and updatedAt are required');
    });

    it('should fail if id is not provided', () => {
      const props = getProjectProps({
        id: undefined,
      });
      const reconstitute: Result<Project, ProjectValidationErrors | string> =
        Project.reconstitute(props);
      if (reconstitute.success) {
        throw new Error('Project reconstitution should have failed');
      }
      expect(reconstitute.error).toBe('id is required');
    });

    it('should be success if all props are valid', () => {
      const props = getProjectProps({
        id: '123',
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      const reconstitute: Result<Project, ProjectValidationErrors | string> =
        Project.reconstitute(props);
      if (!reconstitute.success) {
        throw new Error('Project reconstitution should have succeeded');
      }
    });
  });

  describe('toPrimitive', () => {
    it('should convert a project to a primitive object (without id)', () => {
      const props = getProjectProps();
      const project = Project.create(props);
      if (!project.success) {
        throw new Error('Project creation should have succeeded');
      }
      const primitive = project.value.toPrimitive();
      console.group('without id and createdAt and updatedAt');
      console.log('props', JSON.stringify(props, null, 2));
      console.log('primitive', JSON.stringify(primitive, null, 2));
      console.groupEnd();
      expect(primitive).toEqual(props);
    });
    it('should convert a project to a primitive object (with id)', () => {
      const props = getProjectProps({
        id: '123',
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      const project = Project.reconstitute(props);
      if (!project.success) {
        throw new Error('Project creation should have succeeded');
      }
      const primitive = project.value.toPrimitive();
      console.group('with id and createdAt and updatedAt');
      console.log('props', JSON.stringify(props, null, 2));
      console.log('primitive', JSON.stringify(primitive, null, 2));
      console.groupEnd();
      expect(primitive).toEqual(props);
    });
  });

  describe('addProjectRole', () => {
    // it('should add a project role to the project', () => {
    //   const projectResult = Project.create(
    //     getProjectProps({
    //       id: '123',
    //     }),
    //   );
    //   if (!projectResult.success) {
    //     throw new Error('Project creation should have succeeded');
    //   }
    //   const techStack = TechStack.reconstitute({
    //     id: '1',
    //     name: 'React',
    //     iconUrl: 'https://react.dev/favicon.ico',
    //   });
    //   if (!techStack.success) {
    //     throw new Error(JSON.stringify(techStack.error));
    //   }
    //   const projectRole = ProjectRole.create({
    //     projectId: 'id',
    //     roleTitle: 'Developer',
    //     description: '...',
    //     isFilled: false,
    //     skillSet: [techStack.value],
    //   });
    //   if (!projectRole.success) {
    //     throw new Error(JSON.stringify(projectRole.error));
    //   }
    //   const project = projectResult.value;
    //   const addProjectRoleResult: Result<ProjectRole, string> =
    //     project.addProjectRole(projectRole.value);
    //   if (!addProjectRoleResult.success) {
    //     throw new Error(addProjectRoleResult.error);
    //   }
    //   expect(project.toPrimitive().projectRoles).toHaveLength(1);
    // });

    it('should fail if project id is not provided', () => {
      const projectResult = Project.create(
        getProjectProps({
          id: '123',
        }),
      );
      if (!projectResult.success) {
        throw new Error('Project creation should have succeeded');
      }
      const techStack = TechStack.reconstitute({
        id: '1',
        name: 'React',
        iconUrl: 'https://react.dev/favicon.ico',
      });
      if (!techStack.success) {
        throw new Error(JSON.stringify(techStack.error));
      }

      const projectRole = ProjectRole.create({
        projectId: '',
        roleTitle: 'Developer',
        description: '...',
        isFilled: false,
        skillSet: [techStack.value],
      });
      if (projectRole.success) {
        throw new Error('Project role creation should have failed');
      }
      expect(projectRole.error).toEqual({
        projectId: 'Project ID is required',
      });
    });
  });

  describe('hasRoleWithName', () => {
    // it('should return true if a role with the same name exists (case-insensitive)', () => {
    //   const techStack = TechStack.reconstitute({
    //     id: '1',
    //     name: 'React',
    //     iconUrl: 'https://react.dev/favicon.ico',
    //   });
    //   if (!techStack.success) {
    //     throw new Error(JSON.stringify(techStack.error));
    //   }
    //   const projectResult = Project.create(
    //     getProjectProps({
    //       id: '123',
    //     }),
    //   );
    //   if (!projectResult.success) {
    //     throw new Error('Project creation should have succeeded');
    //   }
    //   const projectRole = ProjectRole.create({
    //     projectId: '123',
    //     roleTitle: 'Developer',
    //     description: '...',
    //     isFilled: false,
    //     skillSet: [techStack.value],
    //   });
    //   if (!projectRole.success) {
    //     throw new Error(JSON.stringify(projectRole.error));
    //   }
    //   const project = projectResult.value;
    //   const addProjectRoleResult: Result<ProjectRole, string> =
    //     project.addProjectRole(projectRole.value);
    //   if (!addProjectRoleResult.success) {
    //     throw new Error(JSON.stringify(addProjectRoleResult.error));
    //   }
    //   expect(project.hasRoleWithTitle('Developer')).toBe(true);
    //   expect(project.hasRoleWithTitle('developer')).toBe(true); // Test de la casse
    // });
    // it('should return false if no role with that name exists', () => {
    //   const projectResult = Project.create(
    //     getProjectProps({
    //       id: '123',
    //     }),
    //   );
    //   if (!projectResult.success) {
    //     throw new Error(JSON.stringify(projectResult.error));
    //   }
    //   const project = projectResult.value;
    //   expect(project.hasRoleWithTitle('Developer')).toBe(false);
    // });
  });

  describe('hasOwnerId', () => {
    it('should return true if the project has the ownerId', () => {
      const user = User.create({
        id: '123',
        username: 'test',
        email: 'test@test.com',
      });
      if (!user.success) {
        throw new Error('User creation should have succeeded');
      }
      const props = getProjectProps({
        ownerId: '123',
      });
      const project = Project.create(props);
      if (!project.success) {
        throw new Error('Project creation should have succeeded');
      }
      expect(project.value.hasOwnerId(user.value.toPrimitive().id)).toBe(true);
    });

    it('should return false if the ownerId is not same than the userId', () => {
      const user = User.create({
        id: '456',
        username: 'test',
        email: 'test@test.com',
      });
      if (!user.success) {
        throw new Error('User creation should have succeeded');
      }

      const ownerId = '123';
      const props = getProjectProps({
        ownerId,
      });
      const project = Project.create(props);
      if (!project.success) {
        throw new Error('Project creation should have succeeded');
      }
      expect(project.value.hasOwnerId(user.value.toPrimitive().id)).toBe(false);
    });
  });

  describe('immutability', () => {
    // it('should return immutable copy of projectRoles', () => {
    //   const techStack = TechStack.reconstitute({
    //     id: '1',
    //     name: 'React',
    //     iconUrl: 'https://react.dev/favicon.ico',
    //   });
    //   if (!techStack.success) {
    //     throw new Error(JSON.stringify(techStack.error));
    //   }
    //   const props = getProjectProps({
    //     id: '123',
    //   });
    //   const project = Project.create(props);
    //   if (!project.success) {
    //     throw new Error(JSON.stringify(project.error));
    //   }
    //   const projectRole = ProjectRole.create({
    //     projectId: '123',
    //     roleTitle: 'Test Role',
    //     description: 'Test Description',
    //     isFilled: false,
    //     skillSet: [techStack.value],
    //   });
    //   if (!projectRole.success) {
    //     throw new Error(JSON.stringify(projectRole.error));
    //   }
    //   const addProjectRoleResult: Result<ProjectRole, string> =
    //     project.value.addProjectRole(projectRole.value);
    //   if (!addProjectRoleResult.success) {
    //     throw new Error(JSON.stringify(addProjectRoleResult.error));
    //   }
    //   const projectRoles = project.value.toPrimitive().projectRoles;
    //   console.log('before', JSON.stringify(projectRoles, null, 2));
    //   if (projectRoles) {
    //     const projectRole = ProjectRole.create({
    //       projectId: '123',
    //       roleTitle: 'Test Role',
    //       description: 'Test Description',
    //       isFilled: false,
    //       skillSet: [techStack.value],
    //     });
    //     if (!projectRole.success) {
    //       throw new Error(JSON.stringify(projectRole.error));
    //     }
    //     projectRoles.push(projectRole.value);
    //   }
    //   console.log('after', projectRoles);
    //   expect(project.value.toPrimitive().projectRoles).toHaveLength(1);
    // });
  });
});

const getProjectProps = (
  overrides: Partial<ProjectCreateProps> = {},
): ProjectCreateProps => ({
  title: 'Test Project',
  ownerId: '123',
  description: 'Test Description',
  shortDescription: 'Test Short Description',
  // projectImage: 'https://test.com',
  techStacks: [createTechStack('ts-1', 'Test Tech Stack', 'https://test.com')],
  // projectRoles: [],
  // projectMembers: [
  //   {
  //     userId: '1',
  //     name: 'jhonDow',
  //     role: 'developer',
  //   },
  // ],
  ...overrides,
});

const createTechStack = (id: string, name: string, iconUrl: string) => {
  const result = TechStack.reconstitute({
    id,
    name,
    iconUrl,
  });
  if (!result.success) {
    throw new Error('Failed to create tech stack');
  }
  return result.value.toPrimitive();
};
