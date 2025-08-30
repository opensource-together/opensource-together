import { Result } from '@/libs/result';
import { Test, TestingModule } from '@nestjs/testing';
import { TechStack } from '../domain/tech-stack';
import {
  TECH_STACK_REPOSITORY,
  ITechStackRepository,
} from '../repositories/tech-stack.repository.interface';
import { TechStackService } from './tech-stack.service';

describe('TechStackService', () => {
  let service: TechStackService;
  let mockRepository: jest.Mocked<ITechStackRepository>;

  beforeEach(async () => {
    mockRepository = {
      getAll: jest.fn(),
      findByIds: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TechStackService,
        {
          provide: TECH_STACK_REPOSITORY,
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<TechStackService>(TechStackService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAllTechStacks', () => {
    it('should return languages and technologies separated by type', async () => {
      const mockTechStacks: TechStack[] = [
        {
          id: '1',
          name: 'React',
          iconUrl: 'https://example.com/react.svg',
          type: 'TECH',
        },
        {
          id: '2',
          name: 'TypeScript',
          iconUrl: 'https://example.com/typescript.svg',
          type: 'LANGUAGE',
        },
        {
          id: '3',
          name: 'Node.js',
          iconUrl: 'https://example.com/nodejs.svg',
          type: 'TECH',
        },
      ];

      mockRepository.getAll.mockResolvedValue(Result.ok(mockTechStacks));

      const result = await service.getAllTechStacks();

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.value.languages).toHaveLength(1);
        expect(result.value.technologies).toHaveLength(2);
        expect(result.value.languages[0].name).toBe('TypeScript');
        expect(result.value.technologies[0].name).toBe('React');
      }
    });

    it('should return error when repository fails', async () => {
      mockRepository.getAll.mockResolvedValue(Result.fail('DATABASE_ERROR'));

      const result = await service.getAllTechStacks();

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe('DATABASE_ERROR');
      }
    });
  });
});
