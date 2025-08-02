import { Injectable } from '@nestjs/common';
import { BeforeHook, Hook } from '@thallesp/nestjs-better-auth';
import { CommandBus } from '@nestjs/cqrs';
import { CreateUserGhTokenCommand } from '@/contexts/github/use-cases/commands/create-user-gh-token.command';
import { Logger } from '@nestjs/common';

@Hook()
@Injectable()
export class BetterAuthGithubHook {
  constructor(private readonly commandBus: CommandBus) {}

  @BeforeHook('/sign-in/social')
  async handle(ctx: any) {
    if (ctx.provider === 'github') {
      const { userData, oAuthTokens } = ctx;

      try {
        // Créer les credentials GitHub
        if (oAuthTokens?.access_token) {
          const createUserGhTokenCommand = new CreateUserGhTokenCommand({
            userId: userData.id,
            githubUserId: userData.id, // ou extraire depuis les données GitHub
            githubAccessToken: oAuthTokens.access_token,
          });
          await this.commandBus.execute(createUserGhTokenCommand);
        }
      } catch (error) {
        Logger.error('Erreur dans le hook GitHub:', error);
        // Ne pas throw l'erreur pour ne pas bloquer l'authentification
      }
    }

    return ctx;
  }
}
