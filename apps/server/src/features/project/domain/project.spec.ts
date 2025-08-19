import {
  Project,
  validateProject,
  canUserModifyProject,
  validateProjectRole,
} from './project';

describe('Project Domain Rules', () => {
  const validProjectData = {
    ownerId: 'user123',
    title: 'Test Project',
    description: 'This is a test project description',
    image: 'https://example.com/image.jpg',
    techStacks: ['ts1'],
    categories: ['cat1'],
  };

  // Project Creation tests removed as createProject function no longer exists

  describe('Project Validation', () => {
    it('should return null for valid project', () => {
      const errors = validateProject(validProjectData);
      expect(errors).toBeNull();
    });

    it.each([
      ['title', '', 'domain: Title is required'],
      [
        'title',
        'a'.repeat(101),
        'domain: Title must be less than 100 characters',
      ],
      ['description', '', 'domain: Description is required'],
      [
        'description',
        'a'.repeat(1001),
        'domain: Description must be less than 1000 characters',
      ],
      ['techStacks', [], 'domain: At least one tech stack is required'],
      ['categories', [], 'domain: At least one category is required'],
    ])('should validate %s', (field, value, expectedError) => {
      const testData = { ...validProjectData, [field]: value };
      const errors = validateProject(testData);

      expect(errors).not.toBeNull();
      expect(errors![field]).toBe(expectedError);
    });

    // Tech stack structure validation removed as validation now expects string IDs
    // Category structure validation removed as validation now expects string IDs
    // Tech stack type validation removed as validation now expects string IDs
  });

  describe('Project Permissions', () => {
    it('should allow project owner to modify project', () => {
      const project: Project = {
        id: 'proj123',
        ownerId: 'user123',
        title: 'Test Project',
        description: 'This is a test project description',
        image: 'https://example.com/image.jpg',
        techStacks: [
          {
            id: 'ts1',
            name: 'React',
            iconUrl: 'https://react.dev/favicon.ico',
            type: 'TECH' as const,
          },
        ],
        categories: [
          {
            id: 'cat1',
            name: 'Web Development',
          },
        ],
      };

      expect(canUserModifyProject(project, 'user123')).toBe(true);
    });

    it('should deny non-owner from modifying project', () => {
      const project: Project = {
        id: 'proj123',
        ownerId: 'user123',
        title: 'Test Project',
        description: 'This is a test project description',
        image: 'https://example.com/image.jpg',
        techStacks: [
          {
            id: 'ts1',
            name: 'React',
            iconUrl: 'https://react.dev/favicon.ico',
            type: 'TECH' as const,
          },
        ],
        categories: [
          {
            id: 'cat1',
            name: 'Web Development',
          },
        ],
      };

      expect(canUserModifyProject(project, 'user456')).toBe(false);
    });
  });

  describe('Project Data Integrity', () => {
    it('should require owner ID', () => {
      const testData = { ...validProjectData, ownerId: '' };
      const errors = validateProject(testData);

      expect(errors).not.toBeNull();
      expect(errors!.ownerId).toBe('domain: Owner ID is required');
    });

    it('should validate title length', () => {
      const testData = { ...validProjectData, title: 'ab' }; // Too short
      const errors = validateProject(testData);

      expect(errors).not.toBeNull();
      expect(errors!.title).toBe('domain: Title must be at least 3 characters');
    });

    it('should validate description length', () => {
      const testData = { ...validProjectData, description: 'short' }; // Too short
      const errors = validateProject(testData);

      expect(errors).not.toBeNull();
      expect(errors!.description).toBe(
        'domain: Description must be at least 10 characters',
      );
    });
  });

  describe('Project Roles (Optional)', () => {
    const validProjectRoleData = {
      title: 'Frontend Developer',
      description: 'Responsible for building the user interface',
      techStacks: ['ts1'],
    };

    it('should validate a valid project role', () => {
      const errors = validateProjectRole(validProjectRoleData);
      expect(errors).toBeNull();
    });

    it('should require title for project role', () => {
      const invalidData = { ...validProjectRoleData, title: '' };
      const errors = validateProjectRole(invalidData);

      expect(errors).not.toBeNull();
      expect(errors!.title).toBe(
        'domain: Project role title is required for project role',
      );
    });

    it('should require description for project role', () => {
      const invalidData = { ...validProjectRoleData, description: '' };
      const errors = validateProjectRole(invalidData);

      expect(errors).not.toBeNull();
      expect(errors!.description).toBe(
        'domain: Project role description is required for project role',
      );
    });

    it('should require at least one tech stack for project role', () => {
      const invalidData = { ...validProjectRoleData, techStacks: [] };
      const errors = validateProjectRole(invalidData);

      expect(errors).not.toBeNull();
      expect(errors!.techStacks).toBe(
        'domain: At least one tech stack is required for project role',
      );
    });
  });
});
