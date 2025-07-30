import { CommandBus } from '@nestjs/cqrs';
import { UsernameGenerator } from '@/libs/username-generator';
import { User } from '@/contexts/user/domain/user.entity';
import { Result } from '@/libs/result';
import { CreateUserCommand } from '@/contexts/user/use-cases/commands/create-user.command';
import { deleteUser } from 'supertokens-node';
import { Logger } from '@nestjs/common';
import { LOADIPHLPAPI } from 'dns';

export async function handleGoogleSignUp(
  userInfo: {
    id: string;
    email: string;
    // provider: string;
    picture: string;
  },
  commandBus: CommandBus,
): Promise<void> {
  const { id, email, picture } = userInfo;

  try {
    // Générer un username unique à partir de l'email
    const username = UsernameGenerator.generateFromEmail(email);

    // Créer l'utilisateur
    const createUserResult: Result<User> = await commandBus.execute(
      new CreateUserCommand({
        id: id,
        username: username,
        email: email,
        name: username,
        provider: 'google',
        login: username,
        avatarUrl: picture,
        location: undefined,
        company: undefined,
        bio: undefined,
        socialLinks: {
          github: undefined,
          website: undefined,
          twitter: undefined,
          linkedin: undefined,
          discord: undefined,
        },
      }),
    );

    Logger.log('createUserResult', createUserResult);
    if (!createUserResult.success) {
      Logger.error('Erreur création utilisateur:', createUserResult.error);
      await deleteUser(id);
      throw new Error('Échec création utilisateur');
    }
  } catch (error) {
    Logger.error('Erreur lors de la création:', error);
    await deleteUser(id);
    throw error;
  }
}
