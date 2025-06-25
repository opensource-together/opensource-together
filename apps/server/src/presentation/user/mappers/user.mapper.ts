import { User } from '@/domain/user/user.entity';
import { UserResponseDto } from '../dtos/user-response.dto';

export class UserMapper {
  static toDto(user: User): UserResponseDto {
    const userState = user.getState();
    return {
      id: userState.id,
      username: userState.username,
      email: userState.email,
      createdAt: userState.createdAt?.toISOString() ?? '',
      updatedAt: userState.updatedAt?.toISOString() ?? '',
    };
  }
}
