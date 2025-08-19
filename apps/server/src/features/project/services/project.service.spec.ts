import { Test, TestingModule } from '@nestjs/testing';
import { ProjectService } from './project.service';
import { PROJECT_REPOSITORY } from '../repositories/project.repository.interface';
import { TECH_STACK_REPOSITORY } from '@/features/tech-stack/repositories/tech-stack.repository.interface';
import { CATEGORY_REPOSITORY } from '@/features/category/repositories/category.repository.interface';
import { Project } from '../domain/project';

describe('ProjectService', () => {
  let service: ProjectService;
  let mockProjectRepository: any;
  let mockTechStackRepository: any;
  let mockCategoryRepository: any;

  beforeEach(async () => {
    mockProjectRepository = {
      findByTitle: jest.fn().mockResolvedValue({ success: false }),
      create: jest.fn().mockResolvedValue({
        success: true,
        value: {
          id: 'proj123',
          ownerId: 'user123',
          title: 'Test Project',
          description: 'This is a test project description',
          image: 'https://example.com/image.jpg',
          categories: [
            {
              id: 'cat1',
              name: 'Web Development',
            },
          ],
          techStacks: [
            {
              id: 'ts1',
              name: 'React',
              iconUrl: 'https://react.dev/favicon.ico',
              type: 'TECH' as const,
            },
          ],
          projectRoles: [],
          teamMembers: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        } as Project,
      }),
    };

    mockTechStackRepository = {
      findByIds: jest.fn().mockImplementation((ids: string[]) => {
        const techStacks = [
          {
            id: 'ts1',
            name: 'React',
            iconUrl: 'https://react.dev/favicon.ico',
            type: 'TECH' as const,
          },
        ];
        return Promise.resolve(
          techStacks.filter((tech) => ids.includes(tech.id)),
        );
      }),
    };

    mockCategoryRepository = {
      findByIds: jest.fn().mockImplementation((ids: string[]) => {
        const categories = [
          {
            id: 'cat1',
            name: 'Web Development',
          },
        ];
        return Promise.resolve(
          categories.filter((cat) => ids.includes(cat.id)),
        );
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProjectService,
        {
          provide: PROJECT_REPOSITORY,
          useValue: mockProjectRepository,
        },
        {
          provide: TECH_STACK_REPOSITORY,
          useValue: mockTechStackRepository,
        },
        {
          provide: CATEGORY_REPOSITORY,
          useValue: mockCategoryRepository,
        },
      ],
    }).compile();

    service = module.get<ProjectService>(ProjectService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createProject', () => {
    const validRequest = {
      ownerId: 'user123',
      title: 'Test Project',
      description: 'This is a test project description',
      categories: ['cat1'],
      techStacks: ['ts1'],
      projectRoles: [],
    };

    it('should create project with only required fields', async () => {
      const result = await service.createProject(validRequest);

      expect(result.success).toBe(true);
      expect(mockProjectRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Test Project',
          ownerId: 'user123',
          description: 'This is a test project description',
          image: '',
          categories: ['cat1'],
          techStacks: ['ts1'],
          projectRoles: [],
        }),
      );
    });

    it('should create project with project roles', async () => {
      const requestWithRoles = {
        ...validRequest,
        projectRoles: [
          {
            title: 'Frontend Developer',
            description: 'Responsible for UI development',
            techStacks: ['ts1'],
          },
        ],
      };

      const result = await service.createProject(requestWithRoles);

      expect(result.success).toBe(true);
      expect(mockProjectRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          projectRoles: expect.arrayContaining([
            expect.objectContaining({
              title: 'Frontend Developer',
            }),
          ]),
        }),
      );
    });

    it('should fail if project title already exists', async () => {
      mockProjectRepository.findByTitle.mockResolvedValue({ success: true });

      const result = await service.createProject(validRequest);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe('DUPLICATE_PROJECT');
      }
    });
  });
});
