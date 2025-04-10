import { UserRepositoryPort } from '@application/ports/user.repository.port';
import { CreateUserDtoInput } from '@application/dto/CreateUserDtoInput.dto';
import { Result } from '@shared/result';
import { UserFactory } from '@/domain/user/user.factory';
import { User } from '@domain/user/user.entity';
export class CreateUserUseCase {
  constructor(private readonly userRepo: UserRepositoryPort) {}

  async execute(createUserDtoInput: CreateUserDtoInput): Promise<Result<User>> {
    const userExistsByUsername = await this.userRepo.findByUsername(
      createUserDtoInput.username,
    );
    const userExistsByEmail = await this.userRepo.findByEmail(
      createUserDtoInput.email,
    );
    if (userExistsByUsername || userExistsByEmail) {
      return Result.fail('Identifiants incorrects.');
    }

    const user = UserFactory.create(
      createUserDtoInput.id,
      createUserDtoInput.username,
      createUserDtoInput.email,
    );
    if (!user.success) return Result.fail(user.error);
    await this.userRepo.save(user.value);

    return Result.ok(user.value);
  }
}
