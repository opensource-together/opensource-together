import { Test, TestingModule } from '@nestjs/testing';
import {
  UpdateProjectCommand,
  UpdateProjectCommandHandler,
} from './update-project.command';
import {
  PROJECT_REPOSITORY_PORT,
  ProjectRepositoryPort,
} from '../../ports/project.repository.port';
import { InMemoryProjectRepository } from '@/contexts/project/infrastructure/repositories/mock.project.repository';
import { Project } from '@/contexts/project/domain/project.entity';
import { MockClock, CLOCK_PORT } from '@/shared/time';

describe('UpdateProjectCommandHandler', () => {
  let handler: UpdateProjectCommandHandler;
  let projectRepo: ProjectRepositoryPort;
  let mockClock: MockClock;

  beforeEach(async () => {
    mockClock = new MockClock(new Date('2024-01-01T10:00:00Z'));

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateProjectCommandHandler,
        {
          provide: PROJECT_REPOSITORY_PORT,
          useClass: InMemoryProjectRepository,
        },
        {
          provide: CLOCK_PORT,
          useValue: mockClock,
        },
      ],
    }).compile();

    handler = module.get<UpdateProjectCommandHandler>(
      UpdateProjectCommandHandler,
    );
    projectRepo = module.get<ProjectRepositoryPort>(PROJECT_REPOSITORY_PORT);
  });

  it('should be an instance of Project', async () => {
    // Arrange
    const command = new UpdateProjectCommand({
      userId: '123',
      id: 'i39pYIlZKF',
      title: 'updated project',
    });
    const result = await handler.execute(command);
    if (!result.success) {
      throw new Error(result.error);
    }
    expect(result.value).toBeInstanceOf(Project);
  });

  it('should return an error if the project is not found', async () => {
    // Arrange
    const command = new UpdateProjectCommand({
      id: 'non-existing-id',
      userId: '123',
    });
    const result = await handler.execute(command);
    if (result.success) {
      throw new Error('Project should not be found');
    }
    expect(result.error).toBe('Project not found');
  });
  it('should return Project with updated title', async () => {
    // Arrange
    const command = new UpdateProjectCommand({
      id: 'i39pYIlZKF',
      title: 'updated project',
      userId: '123',
    });
    const result = await handler.execute(command);
    if (!result.success) {
      throw new Error(result.error);
    }
    expect(result.value.toPrimitive().title).toBe('updated project');
  });

  it('should return Project with updated title', async () => {
    // Arrange
    const command = new UpdateProjectCommand({
      userId: '123',
      id: 'i39pYIlZKF',
      description: 'updated description',
    });
    const result = await handler.execute(command);
    if (!result.success) {
      throw new Error(result.error);
    }
    expect(result.value.toPrimitive().description).toBe('updated description');
  });

  it('should update the updatedAt timestamp', async () => {
    // Arrange - Get original project
    const originalProject = await projectRepo.findById('i39pYIlZKF');
    if (!originalProject.success) throw new Error('Setup failed');

    const originalUpdatedAt = originalProject.value.toPrimitive().updatedAt;

    // Advance clock by 1 hour
    mockClock.advanceBy(1, 'hours');

    // Act - Update project
    const command = new UpdateProjectCommand({
      userId: '123',
      id: 'i39pYIlZKF',
      title: 'updated project',
    });
    const result = await handler.execute(command);

    // Assert
    if (!result.success) throw new Error(result.error);

    const newUpdatedAt = result.value.toPrimitive().updatedAt;
    const expectedTime = new Date('2024-01-01T11:00:00Z'); // Original + 1 hour

    if (!newUpdatedAt || !originalUpdatedAt) {
      throw new Error('Setup failed');
    }
    expect(newUpdatedAt).toEqual(expectedTime);
    expect(newUpdatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime());
  });
  it('should return an error if the user is not the owner of the project', async () => {
    // Arrange
    const command = new UpdateProjectCommand({
      id: 'i39pYIlZKF',
      title: 'updated project',
      userId: '456',
    });
    const result = await handler.execute(command);
    if (result.success) {
      throw new Error('User should not be the owner of the project');
    }
    expect(result.error).toBe('User is not the owner of the project');
  });

  it('should return an error if the title field is not valid', async () => {
    // Arrange
    const command = new UpdateProjectCommand({
      id: 'i39pYIlZKF',
      title: '',
      userId: '123',
    });
    const result = await handler.execute(command);
    if (result.success) {
      throw new Error('Project should not be valid');
    }
    expect(result.error).toEqual({
      title: 'Title is required',
    });
  });
});
