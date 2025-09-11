import { KeyFeature, TeamMember } from '@prisma/client';

export interface Project {
  id?: string;
  owner?: { id: string; username: string; avatarUrl: string };
  title: string;
  description: string;
  image: string;
  categories: Category[];
  techStacks: TechStack[];
  keyFeatures: KeyFeature[];
  projectRoles?: ProjectRole[];
  teamMembers?: TeamMember[];
  coverImages?: string[];
  readme?: string;
  externalLinks?: ExternalLink[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ProjectSummary {
  id?: string;
  owner?: { id: string; username: string; avatarUrl: string };
  title: string;
  description: string;
  image: string;
  techStacks: TechStack[];
  teamMembers?: TeamMember[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ValidateProjectDto {
  ownerId: string;
  title: string;
  description: string;
  image: string;
  categories: string[];
  techStacks: string[];
  coverImages?: string[];
  readme?: string;
  externalLinks?: ExternalLink[];
}

export interface ValidateProjectRoleDto {
  title: string;
  description: string;
  techStacks: string[];
}

export interface ExternalLink {
  id?: string;
  type: 'GITHUB' | 'TWITTER' | 'LINKEDIN' | 'DISCORD' | 'WEBSITE' | 'OTHER';
  url: string;
}

export interface TechStack {
  id: string;
  name: string;
  iconUrl: string;
  type: 'LANGUAGE' | 'TECH';
}

export interface Category {
  id: string;
  name: string;
}

export interface ProjectRole {
  projectId?: string;
  id?: string;
  title: string;
  description: string;
  isFilled?: boolean;
  techStacks: TechStack[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ValidationErrors {
  [key: string]: string;
}

export function validateProject(
  project: Partial<ValidateProjectDto>,
): ValidationErrors | null {
  const errors: ValidationErrors = {};

  if (!project.ownerId) errors.ownerId = 'domain: Owner ID is required';

  if (!project.title?.trim()) errors.title = 'domain: Title is required';
  if (project.title && project.title.length < 3)
    errors.title = 'domain: Title must be at least 3 characters';
  if (project.title && project.title.length > 100)
    errors.title = 'domain: Title must be less than 100 characters';

  if (!project.description?.trim())
    errors.description = 'domain: Description is required';
  if (project.description && project.description.length < 10)
    errors.description = 'domain: Description must be at least 10 characters';
  if (project.description && project.description.length > 1000)
    errors.description =
      'domain: Description must be less than 1000 characters';

  if (!project.techStacks?.length)
    errors.techStacks = 'domain: At least one tech stack is required';
  if (!project.categories?.length)
    errors.categories = 'domain: At least one category is required';
  if (project.coverImages && project.coverImages.length > 4)
    errors.coverImages = 'domain: At most 4 cover images are allowed';

  return Object.keys(errors).length > 0 ? errors : null;
}

export function validateProjectRole(
  role: Partial<ValidateProjectRoleDto>,
): ValidationErrors | null {
  const errors: ValidationErrors = {};

  if (!role.title?.trim())
    errors.title = 'domain: Project role title is required for project role';
  if (!role.description?.trim())
    errors.description =
      'domain: Project role description is required for project role';
  if (!role.techStacks?.length)
    errors.techStacks =
      'domain: At least one tech stack is required for project role';

  return Object.keys(errors).length > 0 ? errors : null;
}

//TO DO : améliorer la fonction pour vérifier les permissions
export function canUserModifyProject(
  project: Project,
  userId: string,
): boolean {
  return project.owner?.id === userId;
}
