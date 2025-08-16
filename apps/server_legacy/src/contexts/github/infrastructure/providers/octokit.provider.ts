import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OAuthApp } from 'octokit';

export const OCTOKIT_OAUTH_PROVIDER = 'OCTOKIT_OAUTH_PROVIDER';

export const OctokitProvider: Provider<OAuthApp> = {
  provide: OCTOKIT_OAUTH_PROVIDER,
  useFactory: (configService: ConfigService) => {
    const clientId = configService.getOrThrow<string>('GITHUB_CLIENT_ID');
    const clientSecret = configService.getOrThrow<string>(
      'GITHUB_CLIENT_SECRET',
    );

    return new OAuthApp({
      clientId: clientId,
      clientSecret: clientSecret,
    });
  },
  inject: [ConfigService],
};
