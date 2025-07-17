import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Inject,
} from '@nestjs/common';
import { Octokit } from '@octokit/rest';
import { SessionRequest } from 'supertokens-node/framework/express';
// import { Result } from '@/shared/result';
import {
  USER_GITHUB_CREDENTIALS_REPOSITORY_PORT,
  UserGitHubCredentialsRepositoryPort,
} from '../../use-cases/ports/user-github-credentials.repository.port';
import {
  ENCRYPTION_SERVICE_PORT,
  EncryptionServicePort,
} from '@/contexts/encryption/ports/encryption.service.port';

export interface GithubAuthRequest extends SessionRequest {
  octokit: Octokit;
}

@Injectable()
export class GithubAuthGuard implements CanActivate {
  constructor(
    @Inject(USER_GITHUB_CREDENTIALS_REPOSITORY_PORT)
    private readonly userGitHubCredentialsRepo: UserGitHubCredentialsRepositoryPort,
    @Inject(ENCRYPTION_SERVICE_PORT)
    private readonly encryptionService: EncryptionServicePort,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<GithubAuthRequest>();

    // Vérifier que l'utilisateur est connecté (SuperTokens)
    if (!request.session?.getUserId()) {
      // throw new UnauthorizedException('User not authenticated');
      const octokit = new Octokit({
        auth: process.env.GH_TOKEN_OST_PUBLIC,
      });
      console.log('mode public');
      request.octokit = octokit;
      return true;
    }

    const userId = request.session.getUserId();

    // Récupérer et décrypter le token GitHub
    const userGhTokenResult =
      await this.userGitHubCredentialsRepo.findGhTokenByUserId(userId);
    if (!userGhTokenResult.success) {
      throw new UnauthorizedException('GitHub credentials not found');
    }

    console.log({ userGhTokenResult });
    const decryptedTokenResult = this.encryptionService.decrypt(
      userGhTokenResult.value,
    );
    if (!decryptedTokenResult.success) {
      throw new UnauthorizedException('Failed to decrypt GitHub token');
    }

    // Créer l'instance Octokit et l'attacher à la requête
    const octokit = new Octokit({
      auth: decryptedTokenResult.value,
    });
    // Injecter Octokit dans la requête
    request.octokit = octokit;

    return true;
  }
}
