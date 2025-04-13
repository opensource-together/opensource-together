export class CreateProjectDtoInput {
  id: string;
  title: string;
  description: string;
  link: string;
  status: 'pending' | 'in_progress' | 'completed';
  userId: string;
  techStacks: string[];
}
