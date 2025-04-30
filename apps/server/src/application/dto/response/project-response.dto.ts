export class ProjectResponseDto {
  id: string | null;
  title: string;
  description: string;
  status: string | null;
  link: string | null;
  userId: string;
  techStacks: { id: string; name: string; iconUrl: string }[];
}
