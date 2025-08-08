import { Injectable } from '@nestjs/common';
import { AfterHook, Hook } from '@thallesp/nestjs-better-auth';
import { CreateUserGhTokenCommand } from '@/contexts/github/use-cases/commands/create-user-gh-token.command';
import { Logger } from '@nestjs/common';
import { getCommandBus } from '@/app-context';
import { CommandBus, ICommand } from '@nestjs/cqrs';

@Hook()
@Injectable()
export class BetterAuthGithubHook {
  constructor() {}

  @AfterHook('/callback/:id')
  async handle(ctx: any): Promise<any> {
    if (ctx.params.id !== 'github') return;

    const user = ctx.context?.newSession?.user;

    Logger.log('✅ AfterHook déclenché pour GitHub');

    if (!user) {
      Logger.warn('⚠️ Aucun utilisateur trouvé dans newSession');
      return ctx;
    }

    Logger.debug('👤 user:', JSON.stringify(user, null, 2));

    // ✅ Nouveau : récupération du compte GitHub associé à l'user
    const githubAccount = await ctx.context.internalAdapter.findAccountByUserId(
      user.id,
      'github',
    );

    Logger.debug('🔗 githubAccount:', JSON.stringify(githubAccount, null, 2));

    if (!githubAccount) {
      Logger.warn('⚠️ Aucun compte GitHub trouvé pour cet utilisateur');
      return ctx;
    }

    try {
      const commandBus: CommandBus<ICommand> = getCommandBus();
      const createUserGhTokenCommand = new CreateUserGhTokenCommand({
        userId: user.id,
        githubUserId: githubAccount.providerAccountId,
        githubAccessToken: githubAccount.accessToken,
      });

      await commandBus.execute(createUserGhTokenCommand);
    } catch (error) {
      Logger.error('❌ Erreur dans le AfterHook GitHub:', error);
    }

    return ctx;
  }
}
