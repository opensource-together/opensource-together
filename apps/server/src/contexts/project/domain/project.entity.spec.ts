import { Result } from '@/shared/result';
import {
  Project,
  ProjectCreateProps,
  ProjectValidationErrors,
} from './project.entity';

describe('Domain Project Entity', () => {
  describe('create', () => {
    it('should create a project with valid properties', () => {
      const props = getValidProjectProps();
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
            name: 'Test Role',
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
            name: 'Test Role',
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
            name: '',
            description: 'Test Description',
          },
        ],
        {
          projectRoles: 'Name for project roles is required',
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
        const props = getValidProjectProps({ [field]: value as any });
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
});

const getValidProjectProps = (
  overrides: Partial<ProjectCreateProps> = {},
): ProjectCreateProps => ({
  title: 'Test Project',
  ownerId: '123',
  description: 'Test Description',
  difficulty: 'easy',
  githubLink: 'https://github.com/test',
  techStacks: [
    {
      id: 'ts-1',
      name: 'Test Tech Stack',
      iconUrl: 'https://test.com',
    },
  ],
  projectRoles: [
    {
      name: 'Test Role',
      description: 'Test Description',
    },
  ],
  projectMembers: [
    {
      userId: '1',
      role: 'developer',
    },
  ],
  ...overrides,
});
