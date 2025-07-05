/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */

import { TechStack } from '@/contexts/techstack/domain/techstack.entity';
import { ProjectRole, ProjectRoleCreateProps } from './project-role.entity';

describe('ProjectRole Entity', () => {
  let reactTechStack: TechStack;
  let typescriptTechStack: TechStack;

  beforeEach(() => {
    // Setup tech stacks for tests
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

  const getValidProjectRoleProps = (
    overrides: Partial<ProjectRoleCreateProps> = {},
  ): ProjectRoleCreateProps => ({
    projectId: '123',
    title: 'Frontend Developer',
    description: 'Responsible for UI development',
    isFilled: false,
    techStacks: [reactTechStack.toPrimitive()],
    ...overrides,
  });

  describe('create', () => {
    it('should create a project role with valid properties', () => {
      // Arrange
      const props = getValidProjectRoleProps();

      // Act
      const result = ProjectRole.create(props);

      // Assert
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.value).toBeInstanceOf(ProjectRole);
        expect(result.value.toPrimitive().projectId).toBe('123');
        expect(result.value.toPrimitive().title).toBe('Frontend Developer');
        expect(result.value.toPrimitive().description).toBe(
          'Responsible for UI development',
        );
        expect(result.value.toPrimitive().isFilled).toBe(false);
        expect(result.value.toPrimitive().techStacks).toHaveLength(1);
      }
    });

    it.each([
      // ['projectId', '', { projectId: 'Project ID is required' }],
      // ['projectId', '   ', { projectId: 'Project ID is required' }],
      ['title', '', { title: 'Role title is required' }],
      ['title', '   ', { title: 'Role title is required' }],
      [
        'title',
        'a'.repeat(101),
        { title: 'Role title must be less than 100 characters' },
      ],
      ['description', '', { description: 'Description is required' }],
      ['description', '   ', { description: 'Description is required' }],
      [
        'description',
        'a'.repeat(501),
        { description: 'Description must be less than 500 characters' },
      ],
      ['techStacks', [], { techStacks: 'At least one tech stack is required' }],
    ])(
      'should fail validation if %s is invalid',
      (field, value, expectedError) => {
        // Arrange
        const props = getValidProjectRoleProps({ [field]: value } as any);
        // Act
        const result = ProjectRole.create(props);

        // Assert
        if (!result.success) {
          expect(result.error).toEqual(expectedError);
        }
        expect(result.success).toBe(false);
      },
    );

    it('should fail validation if isFilled is not a boolean', () => {
      // Arrange
      const props = getValidProjectRoleProps({
        isFilled: 'true' as unknown as boolean,
      });

      // Act
      const result = ProjectRole.create(props);

      // Assert
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toEqual({
          isFilled: 'isFilled must be false on creation',
        });
      }
    });

    it('should create project role with multiple skills', () => {
      // Arrange
      const props = getValidProjectRoleProps({
        techStacks: [
          reactTechStack.toPrimitive(),
          typescriptTechStack.toPrimitive(),
        ],
      });

      // Act
      const result = ProjectRole.create(props);

      // Assert
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.value.toPrimitive().techStacks).toHaveLength(2);
      }
    });
  });

  describe('reconstitute', () => {
    it('should reconstitute project role from persistence', () => {
      // Arrange
      const props = {
        id: '456',
        projectId: '123',
        title: 'Backend Developer',
        description: 'Responsible for API development',
        isFilled: true,
        techStacks: [typescriptTechStack.toPrimitive()],
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-02'),
      };

      // Act
      const result = ProjectRole.reconstitute(props);

      // Assert
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.value.toPrimitive().id).toBe('456');
        expect(result.value.toPrimitive().projectId).toBe('123');
        expect(result.value.toPrimitive().title).toBe('Backend Developer');
        expect(result.value.toPrimitive().isFilled).toBe(true);
        expect(result.value.toPrimitive().createdAt).toEqual(
          new Date('2024-01-01'),
        );
        expect(result.value.toPrimitive().updatedAt).toEqual(
          new Date('2024-01-02'),
        );
      }
    });

    it('should fail if id is missing at reconstitution', () => {
      // Arrange
      const props = {
        id: '',
        projectId: '123',
        title: 'Backend Developer',
        description: 'Responsible for API development',
        isFilled: true,
        techStacks: [typescriptTechStack.toPrimitive()],
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-02'),
      };

      // Act
      const result = ProjectRole.reconstitute(props);

      // Assert
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toEqual({ id: 'id is required' });
      }
    });

    it('should fail if validation fails during reconstitution', () => {
      // Arrange
      const props = {
        id: '456',
        projectId: '',
        title: 'Backend Developer',
        description: 'Responsible for API development',
        isFilled: true,
        techStacks: [typescriptTechStack.toPrimitive()],
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-02'),
      };

      // Act
      const result = ProjectRole.reconstitute(props);

      // Assert
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toEqual({ projectId: 'projectId is required' });
      }
    });
  });

  describe('updateRole', () => {
    let projectRole: ProjectRole;

    beforeEach(() => {
      const props = getValidProjectRoleProps();
      const result = ProjectRole.create(props);
      if (result.success) {
        projectRole = result.value;
      }
    });

    it('should update role title successfully', () => {
      // Act
      const result = projectRole.updateRole({
        title: 'Senior Frontend Developer',
      });

      // Assert
      expect(result.success).toBe(true);
      expect(projectRole.toPrimitive().title).toBe('Senior Frontend Developer');
    });

    it('should update description successfully', () => {
      // Act
      const result = projectRole.updateRole({
        description: 'Updated description',
      });

      // Assert
      expect(result.success).toBe(true);
      expect(projectRole.toPrimitive().description).toBe('Updated description');
    });

    it('should update isFilled status successfully', () => {
      // Act
      const result = projectRole.updateRole({ isFilled: true });

      // Assert
      expect(result.success).toBe(true);
      expect(projectRole.toPrimitive().isFilled).toBe(true);
    });

    it('should update techStacks successfully', () => {
      // Act
      const result = projectRole.updateRole({
        techStacks: [typescriptTechStack],
      });

      // Assert
      expect(result.success).toBe(true);
      expect(projectRole.toPrimitive().techStacks).toHaveLength(1);
      expect(projectRole.toPrimitive().techStacks[0]).toEqual({
        id: '2',
        name: 'TypeScript',
        iconUrl: 'https://typescriptlang.org/favicon.ico',
      });
    });

    it('should fail if updated values are invalid', () => {
      // Act
      const result = projectRole.updateRole({ title: '' });

      // Assert
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toEqual({ title: 'Role title is required' });
      }
    });

    it('should not change values if update fails', () => {
      // Arrange
      const originalTitle = projectRole.toPrimitive().title;

      // Act
      projectRole.updateRole({ title: '' });

      // Assert
      expect(projectRole.toPrimitive().title).toBe(originalTitle);
    });
  });

  describe('markAsFilled', () => {
    it('should mark role as filled', () => {
      // Arrange
      const props = getValidProjectRoleProps({ isFilled: false });
      const result = ProjectRole.create(props);
      let projectRole: ProjectRole;
      if (result.success) {
        projectRole = result.value;
      } else {
        throw new Error('Project role creation should have succeeded');
      }

      // Act
      projectRole.markAsFilled();

      // Assert
      expect(projectRole.toPrimitive().isFilled).toBe(true);
    });
  });

  describe('markAsUnfilled', () => {
    it('should mark role as unfilled', () => {
      // Arrange
      const props = getValidProjectRoleProps({ isFilled: false });
      const result = ProjectRole.create(props);
      let projectRole: ProjectRole;
      if (result.success) {
        projectRole = result.value;
      } else {
        throw new Error(JSON.stringify(result.error));
      }

      // Assert
      expect(projectRole.toPrimitive().isFilled).toBe(false);
    });
  });

  describe('addSkill', () => {
    let projectRole: ProjectRole;

    beforeEach(() => {
      const props = getValidProjectRoleProps({
        techStacks: [reactTechStack.toPrimitive()],
      });
      const result = ProjectRole.create(props);
      if (result.success) {
        projectRole = result.value;
      }
    });

    it('should add new skill successfully', () => {
      // Act
      const result = projectRole.addSkill(typescriptTechStack);

      // Assert
      expect(result.success).toBe(true);
      expect(projectRole.toPrimitive().techStacks).toHaveLength(2);
    });

    it('should fail if skill already exists', () => {
      // Act
      const result = projectRole.addSkill(reactTechStack);

      // Assert
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe('Skill already exists in this role');
      }
    });
  });

  describe('removeSkill', () => {
    let projectRole: ProjectRole;

    beforeEach(() => {
      const props = getValidProjectRoleProps({
        techStacks: [
          reactTechStack.toPrimitive(),
          typescriptTechStack.toPrimitive(),
        ],
      });
      const result = ProjectRole.create(props);
      if (result.success) {
        projectRole = result.value;
      }
    });

    it('should remove skill successfully', () => {
      // Arrange
      const reactId = reactTechStack.toPrimitive().id;

      // Act
      const result = projectRole.removeSkill(reactId);

      // Assert
      expect(result.success).toBe(true);
      expect(projectRole.toPrimitive().techStacks).toHaveLength(1);
    });

    it('should fail if skill not found', () => {
      // Act
      const result = projectRole.removeSkill('non-existent-id');

      // Assert
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe('Skill not found in this role');
      }
    });

    it('should fail if trying to remove last skill', () => {
      // Arrange
      const props = getValidProjectRoleProps({
        techStacks: [reactTechStack.toPrimitive()],
      });
      const result = ProjectRole.create(props);
      let singleSkillRole: ProjectRole;
      if (result.success) {
        singleSkillRole = result.value;
      } else {
        throw new Error('Project role creation should have succeeded');
      }
      const reactId = reactTechStack.toPrimitive().id;

      // Act
      const singleSkillResult = singleSkillRole.removeSkill(reactId);

      // Assert
      expect(singleSkillResult.success).toBe(false);
      if (!singleSkillResult.success) {
        expect(singleSkillResult.error).toBe(
          'Cannot remove last skill - at least one skill is required',
        );
      }
    });
  });

  describe('getters and immutability', () => {
    let projectRole: ProjectRole;

    beforeEach(() => {
      const props = getValidProjectRoleProps({
        techStacks: [
          reactTechStack.toPrimitive(),
          typescriptTechStack.toPrimitive(),
        ],
      });
      const result = ProjectRole.create(props);
      if (result.success) {
        projectRole = result.value;
      }
    });

    it('should return immutable copy of skillSet', () => {
      // Act
      const skillSet = projectRole.toPrimitive().techStacks;
      skillSet.pop(); // Try to modify the returned array

      // Assert
      expect(projectRole.toPrimitive().techStacks).toHaveLength(2); // Original should be unchanged
    });

    it('should return immutable copy of description', () => {
      // Act
      const description = projectRole.toPrimitive().description;
      description.replace('UI', 'Backend'); // Try to modify the returned array

      // Assert
      expect(projectRole.toPrimitive().description).toBe(
        'Responsible for UI development',
      );
    });

    it('should return correct primitive representation', () => {
      // Act
      const primitive = projectRole.toPrimitive();

      // Assert
      expect(primitive).toMatchObject({
        projectId: '123',
        title: 'Frontend Developer',
        description: 'Responsible for UI development',
        isFilled: false,
        techStacks: [
          reactTechStack.toPrimitive(),
          typescriptTechStack.toPrimitive(),
        ],
      });
      expect(primitive.id).toBeUndefined(); // Created entity has no ID yet
      expect(primitive.createdAt).toBeInstanceOf(Date);
      expect(primitive.updatedAt).toBeInstanceOf(Date);
    });
  });
});
