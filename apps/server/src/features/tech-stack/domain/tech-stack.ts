export interface TechStack {
  id: string;
  name: string;
  iconUrl: string;
  type: 'LANGUAGE' | 'TECH';
}

// Erreurs de validation simples
export interface ValidationErrors {
  [key: string]: string;
}

export function validateTechStack(
  techStack: Partial<TechStack>,
): ValidationErrors | null {
  const errors: ValidationErrors = {};

  if (!techStack.id) errors.id = 'domain: Tech stack ID is required';
  if (!techStack.name?.trim())
    errors.name = 'domain: Tech stack name is required';
  if (!techStack.iconUrl?.trim())
    errors.iconUrl = 'domain: Tech stack icon URL is required';
  if (!['LANGUAGE', 'TECH'].includes(techStack.type ?? ''))
    errors.type = 'domain: Tech stack type must be LANGUAGE or TECH';

  return Object.keys(errors).length > 0 ? errors : null;
}
