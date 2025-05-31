import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { App } from 'octokit';

export const OCTOKIT_PROVIDER = 'OCTOKIT_PROVIDER';

export const OctokitProvider: Provider = {
  provide: OCTOKIT_PROVIDER,
  useFactory: (configService: ConfigService) => {
    const appId = configService.getOrThrow<string>('GITHUB_APP_ID');
    const privateKey = configService.getOrThrow<string>('GITHUB_PRIVATE_KEY');

    return new App({
      appId: appId,
      privateKey: privateKey
    });
  },
  inject: [ConfigService],
};
