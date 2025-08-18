import {
  Project,
  createProject,
  validateProject,
  canUserModifyProject,
  validateProjectRole,
} from './project';

describe('Project Domain Rules', () => {
  const validProjectData = {
    ownerId: 'user123',
    title: 'Test Project',
    description: 'This is a test project description',
    techStacks: [
      {
        id: 'ts1',
        name: 'React',
        iconUrl: 'https://react.dev/favicon.ico',
        type: 'TECH' as const,
      },
    ],
    categories: ['cat1'],
  };

  describe('Project Creation', () => {
    it('should create a valid project with required fields', () => {
      const project = createProject(validProjectData);

      expect(project).toMatchObject(validProjectData);
      expect(project.createdAt).toBeInstanceOf(Date);
      expect(project.updatedAt).toBeInstanceOf(Date);
    });

    it('should throw error for project without title', () => {
      const invalidData = { ...validProjectData, title: '' };

      expect(() => createProject(invalidData)).toThrow(
        'Project validation failed',
      );
    });

    it('should throw error for project without description', () => {
      const invalidData = { ...validProjectData, description: '' };

      expect(() => createProject(invalidData)).toThrow(
        'Project validation failed',
      );
    });

    it('should throw error for project without tech stacks', () => {
      const invalidData = { ...validProjectData, techStacks: [] };

      expect(() => createProject(invalidData)).toThrow(
        'Project validation failed',
      );
    });

    it('should throw error for project without categories', () => {
      const invalidData = { ...validProjectData, categories: [] };

      expect(() => createProject(invalidData)).toThrow(
        'Project validation failed',
      );
    });
  });

  describe('Project Validation', () => {
    it('should return null for valid project', () => {
      const errors = validateProject(validProjectData);
      expect(errors).toBeNull();
    });

    it.each([
      ['title', '', 'Title is required'],
      ['title', 'a'.repeat(101), 'Title must be less than 100 characters'],
      ['description', '', 'Description is required'],
      [
        'description',
        'a'.repeat(1001),
        'Description must be less than 1000 characters',
      ],
      ['techStacks', [], 'At least one tech stack is required'],
      ['categories', [], 'At least one category is required'],
    ])('should validate %s', (field, value, expectedError) => {
      const testData = { ...validProjectData, [field]: value };
      const errors = validateProject(testData);

      expect(errors).not.toBeNull();
      expect(errors![field]).toBe(expectedError);
    });

    it('should validate tech stack structure', () => {
      const testData = {
        ...validProjectData,
        techStacks: [
          {
            id: '',
            name: 'React',
            iconUrl: 'https://react.dev/favicon.ico',
            type: 'TECH' as const,
          },
        ],
      };

      const errors = validateProject(testData);
      expect(errors).not.toBeNull();
      expect(errors!['techStacks[0].id']).toBe('Tech stack ID is required');
    });

    it('should validate category structure', () => {
      const testData = {
        ...validProjectData,
        categories: ['cat1'],
      };

      const errors = validateProject(testData);
      expect(errors).not.toBeNull();
      expect(errors!['categories[0].name']).toBe('Category name is required');
    });

    it('should validate tech stack type', () => {
      const testData = {
        ...validProjectData,
        techStacks: [
          {
            id: 'ts1',
            name: 'React',
            iconUrl: 'https://react.dev/favicon.ico',
            type: 'INVALID' as 'LANGUAGE' | 'TECH',
          },
        ],
      };

      const errors = validateProject(testData);
      expect(errors).not.toBeNull();
      expect(errors!['techStacks[0].type']).toBe(
        'Tech stack type must be LANGUAGE or TECH',
      );
    });
  });

  describe('Project Permissions', () => {
    it('should allow project owner to modify project', () => {
      const project: Project = {
        id: 'proj123',
        ...validProjectData,
      };

      expect(canUserModifyProject(project, 'user123')).toBe(true);
    });

    it('should deny non-owner from modifying project', () => {
      const project: Project = {
        id: 'proj123',
        ...validProjectData,
      };

      expect(canUserModifyProject(project, 'user456')).toBe(false);
    });
  });

  describe('Project Data Integrity', () => {
    it('should require owner ID', () => {
      const testData = { ...validProjectData, ownerId: '' };
      const errors = validateProject(testData);

      expect(errors).not.toBeNull();
      expect(errors!.ownerId).toBe('Owner ID is required');
    });

    it('should validate title length', () => {
      const testData = { ...validProjectData, title: 'ab' }; // Too short
      const errors = validateProject(testData);

      expect(errors).not.toBeNull();
      expect(errors!.title).toBe('Title must be at least 3 characters');
    });

    it('should validate description length', () => {
      const testData = { ...validProjectData, description: 'short' }; // Too short
      const errors = validateProject(testData);

      expect(errors).not.toBeNull();
      expect(errors!.description).toBe(
        'Description must be at least 10 characters',
      );
    });
  });

  describe('Project Roles (Optional)', () => {
    const validProjectRoleData = {
      projectId: 'proj123',
      title: 'Frontend Developer',
      description: 'Responsible for building the user interface',
      techStacks: [
        {
          id: 'ts1',
          name: 'React',
          iconUrl: 'https://react.dev/favicon.ico',
          type: 'TECH' as const,
        },
      ],
    };

    it('should validate a valid project role', () => {
      const errors = validateProjectRole(validProjectRoleData);
      expect(errors).toBeNull();
    });

    it('should require project ID for project role', () => {
      const invalidData = { ...validProjectRoleData, projectId: '' };
      const errors = validateProjectRole(invalidData);

      expect(errors).not.toBeNull();
      expect(errors!.projectId).toBe('Project ID is required');
    });

    it('should require title for project role', () => {
      const invalidData = { ...validProjectRoleData, title: '' };
      const errors = validateProjectRole(invalidData);

      expect(errors).not.toBeNull();
      expect(errors!.title).toBe('Project role title is required');
    });

    it('should require description for project role', () => {
      const invalidData = { ...validProjectRoleData, description: '' };
      const errors = validateProjectRole(invalidData);

      expect(errors).not.toBeNull();
      expect(errors!.description).toBe('Project role description is required');
    });

    it('should require at least one tech stack for project role', () => {
      const invalidData = { ...validProjectRoleData, techStacks: [] };
      const errors = validateProjectRole(invalidData);

      expect(errors).not.toBeNull();
      expect(errors!.techStacks).toBe(
        'At least one tech stack is required for project role',
      );
    });
  });
});
