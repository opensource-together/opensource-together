import { User } from '@/domain/user/user.entity';
import { UserResponseDto } from '../dtos/user-response.dto';

export class UserMapper {
  static toDto(user: User): UserResponseDto {
    return {
      id: user.getId(),
      username: user.getUsername(),
      email: user.getEmail(),
      avatarUrl: user.getAvatarUrl(),
      bio: user.getBio(),
      githubUrl: user.getGithubUrl(),
      createdAt: user.getCreatedAt(),
      updatedAt: user.getUpdatedAt(),
    };
  }
}
