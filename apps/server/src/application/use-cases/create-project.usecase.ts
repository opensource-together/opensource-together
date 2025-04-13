import { Project } from "@/domain/project/project.entity";
import { CreateProjectDtoInput } from "../dto/CreateProjectDtoInputs";
import { Result } from "@/shared/result";
import { ProjectRepositoryPort } from "@application/ports/project.repository.port";
import { ProjectFactory } from "@/domain/project/project.factory";

export class CreateProjectUseCase {
	constructor(private readonly projectRepo: ProjectRepositoryPort) {}

	async execute(createProjectDtoInput: CreateProjectDtoInput): Promise<Result<Project>> {
		const projectExists = await this.projectRepo.findById(createProjectDtoInput.id);
		if (projectExists) {
			return Result.fail('Project already exists');
		}

		const project = ProjectFactory.create(
			createProjectDtoInput.id,
			createProjectDtoInput.title,
			createProjectDtoInput.description,
			createProjectDtoInput.link,
			createProjectDtoInput.status,
			createProjectDtoInput.userId,
			createProjectDtoInput.techStacks
		);

		if (!project.success) {
			return Result.fail(project.error);
		}

		await this.projectRepo.save(project.value);
		return Result.ok(project.value);
	}
}
