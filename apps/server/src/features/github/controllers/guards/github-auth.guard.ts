import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Inject,
  Logger,
} from '@nestjs/common';
import { Octokit } from '@octokit/rest';
import { UserSession } from '@thallesp/nestjs-better-auth';
import {
  USER_GITHUB_CREDENTIALS_REPOSITORY,
  IUserGitHubCredentialsRepository,
} from '../../repositories/user-github-credentials.repository.interface';

export interface GithubAuthRequest extends UserSession {
  octokit: Octokit;
}

@Injectable()
export class GithubAuthGuard implements CanActivate {
  private readonly Logger = new Logger(GithubAuthGuard.name);
  constructor(
    @Inject(USER_GITHUB_CREDENTIALS_REPOSITORY)
    private readonly userGitHubCredentialsRepo: IUserGitHubCredentialsRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<GithubAuthRequest>();

    // Vérifier que l'utilisateur est connecté (SuperTokens)
    if (!request.session?.userId) {
      // throw new UnauthorizedException('User not authenticated');
      const octokit = new Octokit({
        auth: process.env.GH_TOKEN_OST_PUBLIC,
      });
      this.Logger.log('mode public');
      request.octokit = octokit;
      return true;
    }

    const userId = request.session.userId;

    // Récupérer et décrypter le token GitHub
    const userGhTokenResult =
      await this.userGitHubCredentialsRepo.findGhTokenByUserId(userId);
    if (!userGhTokenResult.success) {
      throw new UnauthorizedException('GitHub credentials not found');
    }

    // Créer l'instance Octokit et l'attacher à la requête
    const octokit = new Octokit({
      auth: userGhTokenResult.value,
    });
    // Injecter Octokit dans la requête
    request.octokit = octokit;

    return true;
  }
}
