export interface TechStack {
  id: string;
  name: string;
  iconUrl: string;
  type: 'LANGUAGE' | 'TECH';
}

export interface ProjectRole {
  projectId: string;
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
export function validateProjectRole(
  role: Partial<ProjectRole>,
): ValidationErrors | null {
  const errors: ValidationErrors = {};

  if (!role.projectId?.trim())
    errors.projectId = 'domain: Project ID is required';
  if (!role.title?.trim())
    errors.title = 'domain: Project role title is required';
  if (!role.description?.trim())
    errors.description = 'domain: Project role description is required';
  if (!role.techStacks?.length)
    errors.techStacks =
      'domain: At least one tech stack is required for project role';

  return Object.keys(errors).length > 0 ? errors : null;
}
