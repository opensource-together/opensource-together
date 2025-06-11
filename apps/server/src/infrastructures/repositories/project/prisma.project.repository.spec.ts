import { Test, TestingModule } from '@nestjs/testing';
import { PrismaProjectRepository } from '../prisma.project.repository';
import { PrismaService } from '../../orm/prisma/prisma.service';
import { Project } from '@/domain/project/project.entity';
import { Result } from '@/shared/result';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { ProjectTestBuilder } from '@/shared/__test__/ProjectTestBuilder';
import { PrismaMock } from '@/infrastructures/repositories/__tests__/PrismaMock';

describe('PrismaProjectRepository', () => {});
