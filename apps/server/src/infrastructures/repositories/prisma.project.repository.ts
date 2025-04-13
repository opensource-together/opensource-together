import { Injectable } from '@nestjs/common';
import { ProjectRepositoryPort } from '@application/ports/project.repository.port';
import { PrismaService } from '../orm/prisma/prisma.service';
import { Project } from '@/domain/project/project.entity';
import { ProjectFactory } from '@/domain/project/project.factory';

@Injectable()
export class PrismaProjectRepository implements ProjectRepositoryPort {
	constructor(private readonly prisma: PrismaService) {}

	async save(project: Project): Promise<void> {
		await this.prisma.project.create({
			data: {
				id: project.getId(),
				title: project.getTitle(),
				description: project.getDescription(),
				link: project.getLink(),
				status: project.getStatus(),
				userId: project.getUserId(),
				techStacks: project.getTechStacks(),
			},
		});
	}

	async findById(id: string): Promise<Project | null> {
		const project = await this.prisma.project.findUnique({
			where: { id },
		});
		return project ? ProjectFactory.create(project) : null;
	}

	async findByUserId(userId: string): Promise<Project[] | null> {
		const projects = await this.prisma.project.findMany({
			where: { userId },
		});
		return projects.map(project => ProjectFactory.create(project));
	}
}
