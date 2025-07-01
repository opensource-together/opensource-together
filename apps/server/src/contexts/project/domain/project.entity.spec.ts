import { Result } from '@/shared/result';
import { TechStack } from '@/domain/techStack/techstack.entity';
import {
  Project,
  ProjectCreateProps,
  ProjectValidationErrors,
} from './project.entity';
import { User } from '@/contexts/user/domain/user.entity';

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
      //description
      ['description', '', { description: 'Description is required' }],
      ['description', '   ', { description: 'Description is required' }],
      [
        'description',
        'a'.repeat(1001),
        { description: 'Description must be less than 1000 characters' },
      ],
      //difficulty
      ['difficulty', undefined, { difficulty: 'Difficulty is required' }],
      //techStacks
      ['techStacks', [], { techStacks: 'Tech stacks are required' }],
      [
        'techStacks',
        [{ name: 'Invalid', iconUrl: 'url' }], // Simulating invalid reconstituted TechStack
        { techStacks: 'Tech stacks are not valid' },
      ],
      //projectRoles
      ['projectRoles', [], { projectRoles: 'Project roles are required' }],
      [
        'projectRoles',
        [
          {
            title: 'Test Role',
            description: 'a'.repeat(1001),
          },
        ],
        {
          projectRoles:
            'Description for project roles must be less than 1000 characters',
        },
      ],
      [
        'projectRoles',
        [
          {
            title: 'Test Role',
            description: '',
          },
        ],
        {
          projectRoles: 'Description for project roles is required',
        },
      ],
      [
        'projectRoles',
        [
          {
            title: '',
            description: 'Test Description',
          },
        ],
        {
          projectRoles: 'Title for project roles is required',
        },
      ],
      //projectMembers
      [
        'projectMembers',
        [{ userId: '', role: 'developer' }],
        {
          projectMembers: 'User id for project members is required',
        },
      ],
      [
        'projectMembers',
        [{ userId: '1', role: '' }],
        {
          projectMembers: 'Role for project members is required',
        },
      ],
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

  describe('hasRoleWithName', () => {
    it('should return true if a role with the same name exists (case-insensitive)', () => {
      const props = getProjectProps({
        projectRoles: [{ title: 'Developer', description: '...' }],
      });
      const project = Project.create(props);
      if (!project.success) {
        throw new Error('Project creation should have succeeded');
      }

      expect(project.value.hasRoleWithTitle('Developer')).toBe(true);
      expect(project.value.hasRoleWithTitle('developer')).toBe(true); // Test de la casse
    });

    it('should return false if no role with that name exists', () => {
      const props = getProjectProps({
        projectRoles: [{ title: 'Designer', description: '...' }],
      });
      const project = Project.create(props);
      if (!project.success) {
        throw new Error('Project creation should have succeeded');
      }

      expect(project.value.hasRoleWithTitle('Developer')).toBe(false);
    });
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
    it('should return immutable copy of projectRoles', () => {
      const props = getProjectProps();
      const project = Project.create(props);
      if (!project.success) {
        throw new Error('Project creation should have succeeded');
      }
      const projectRoles = project.value.toPrimitive().projectRoles;
      console.log('before', projectRoles);
      if (projectRoles) {
        projectRoles.push({
          title: 'Test Role',
          description: 'Test Description',
        });
      }
      console.log('after', projectRoles);
      expect(project.value.toPrimitive().projectRoles).toHaveLength(1);
    });
  });
});

const getProjectProps = (
  overrides: Partial<ProjectCreateProps> = {},
): ProjectCreateProps => ({
  title: 'Test Project',
  projectImages: ['https://test.com', 'https://test.com'],
  ownerId: '123',
  description: 'Test Description',
  difficulty: 'easy',
  githubLink: 'https://github.com/test',
  techStacks: [createTechStack('ts-1', 'Test Tech Stack', 'https://test.com')],
  projectRoles: [
    {
      title: 'Test Role',
      description: 'Test Description',
    },
  ],
  projectMembers: [
    {
      userId: '1',
      name: 'jhonDow',
      role: 'developer',
    },
  ],
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
