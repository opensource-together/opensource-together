import { Result } from "@/shared/result";
import { Project } from "./project.entity";

export class ProjectFactory {
	static create(
		id: string,
		title: string,
		description: string,
		link: string,
		status: 'PUBLISHED' | 'DRAFT',
		userId: string,
		techStacks: string[],
	) : Result<Project> {
		return Result.ok(
			new Project({
				id: id,
				title: title,
				description: description,
				link: link,
				status: status,
				userId: userId,
				techStacks: techStacks,
			})
		);
	}
}