export interface Category {
  id: string;
  name: string;
}
export interface ValidationErrors {
  [key: string]: string;
}

export function validateCategory(category: Category): ValidationErrors | null {
  const errors: ValidationErrors = {};
  if (!category.id) errors.id = 'domain: Category ID is required';
  if (!category.name?.trim()) errors.name = 'domain: Category name is required';

  return Object.keys(errors).length > 0 ? errors : null;
}
