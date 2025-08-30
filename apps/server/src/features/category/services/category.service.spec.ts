import { Result } from '@/libs/result';
import { Test, TestingModule } from '@nestjs/testing';
import { Category } from '../domain/category';
import {
  CATEGORY_REPOSITORY,
  ICategoryRepository,
} from '../repositories/category.repository.interface';
import { CategoryService } from './category.service';

describe('CategoryService', () => {
  let service: CategoryService;
  let mockRepository: jest.Mocked<ICategoryRepository>;

  beforeEach(async () => {
    mockRepository = {
      getAll: jest.fn(),
      findByIds: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoryService,
        {
          provide: CATEGORY_REPOSITORY,
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<CategoryService>(CategoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAllCategories', () => {
    it('should return all categories', async () => {
      const mockCategories: Category[] = [
        { id: '1', name: 'Développement Web' },
        { id: '2', name: 'Applications Mobile' },
      ];

      mockRepository.getAll.mockResolvedValue(Result.ok(mockCategories));

      const result = await service.getAllCategories();

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.value).toHaveLength(2);
        expect(result.value[0].name).toBe('Développement Web');
      }
    });

    it('should return error when repository fails', async () => {
      mockRepository.getAll.mockResolvedValue(Result.fail('DATABASE_ERROR'));

      const result = await service.getAllCategories();

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe('DATABASE_ERROR');
      }
    });
  });

  describe('findByIds', () => {
    it('should return categories by ids', async () => {
      const mockCategories: Category[] = [
        { id: '1', name: 'Développement Web' },
      ];

      mockRepository.findByIds.mockResolvedValue(Result.ok(mockCategories));

      const result = await service.findByIds(['1']);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.value).toHaveLength(1);
        expect(result.value[0].id).toBe('1');
      }
    });
  });
});
