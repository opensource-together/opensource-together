export interface ProjectFilterInputsDto {
  title?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  sortOrder?: 'asc' | 'desc';
  roles?: string[];
  techStacks?: string[];
}
