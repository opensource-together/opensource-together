import { Test, TestingModule } from '@nestjs/testing';
import { ProjectService } from './project.service';
import { PROJECT_REPOSITORY } from '../repositories/project.repository.interface';
import { Project } from '../domain/project';

describe('ProjectService', () => {
  let service: ProjectService;
  let mockRepository: any;

  beforeEach(async () => {
    mockRepository = {
      findByTitle: jest.fn().mockResolvedValue({ success: false }),
      create: jest.fn().mockResolvedValue({
        success: true,
        value: {
          id: 'proj123',
          ownerId: 'user123',
          title: 'Test Project',
          description: 'This is a test project description',
          categories: ['cat1'],
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
        } as unknown as Project,
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProjectService,
        {
          provide: PROJECT_REPOSITORY,
          useValue: mockRepository,
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
    };

    it('should create project with only required fields', async () => {
      const result = await service.createProject(validRequest);

      expect(result.success).toBe(true);
      expect(mockRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Test Project',
          projectRoles: [],
          teamMembers: [],
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
            techStacks: [
              {
                id: 'ts1',
                name: 'React',
                iconUrl: 'https://react.dev/favicon.ico',
                type: 'TECH' as const,
              },
            ],
          },
        ],
      };

      const result = await service.createProject(requestWithRoles);

      expect(result.success).toBe(true);
      expect(mockRepository.create).toHaveBeenCalledWith(
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
      mockRepository.findByTitle.mockResolvedValue({ success: true });

      const result = await service.createProject(validRequest);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe('DUPLICATE_PROJECT');
      }
    });
  });
});
