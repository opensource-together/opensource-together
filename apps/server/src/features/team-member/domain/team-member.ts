import { User } from "@prisma/client";
import { Project } from "@/features/project/domain/project";
import { ProjectRole } from "@/features/project-role/domain/project-role";

/**
 * TeamMember
 * @description Represents a user who is a member of a project team.
 * @property {string} id - The unique identifier for the team member entry.
 * @property {object} user - The user who is the team member.
 * @property {object} project - The project the user is a member of.
 * @property {Date} joinedAt - The timestamp when the user joined the project.
 * @property {ProjectRole[]} projectRole - The roles assigned to the team member in the project.
 */
export interface TeamMember {
  id?: string;
  user: User;
  project: Project;
  joinedAt?: Date;
  projectRole: ProjectRole[];
}

export interface ValidateTeamMemberDto {
  user: { id: string; };
  project: { id: string; title: string };
  projectRole: ProjectRole[];
}

export interface ValidationErrors {
  [key: string]: string;
}

export function validateTeamMember(
  data: Partial<ValidateTeamMemberDto>,
): ValidationErrors | null {
  const errors: ValidationErrors = {};

  if (!data.user || !data.user?.id) {
    errors.userId = 'domain: User ID is required';
  }

  if (!data.project) {
    errors.project = 'domain: Project is required';
  }

  if (!data.project?.id) {
    errors.projectId = 'domain: Project ID is required';
  }

  if (!data.project?.title) {
    errors.projectTitle = 'domain: Project Title is required';
  }

  if (!data.projectRole || data.projectRole.length === 0) {
    errors.projectRoleIds = 'domain: At least one project role ID is required';
  }

  return Object.keys(errors).length > 0 ? errors : null;
}
