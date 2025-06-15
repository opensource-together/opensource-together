export class UserResponseDto {
  id: string;
  username: string;
  email: string;
  avatarUrl: string | null;
  bio: string | null;
  githubUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
}
