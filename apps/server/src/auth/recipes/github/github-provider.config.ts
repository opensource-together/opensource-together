import { ConfigService } from '@nestjs/config';

export const githubProviderConfig = (configService: ConfigService) => {
  return {
    thirdPartyId: 'github',
    clients: [
      {
        scope: [
          'read:user',
          'user:email',
          'repo',
          'write:repo_hook',
          'admin:repo_hook',
        ],

        clientId: configService.get('GITHUB_CLIENT_ID') as string,
        clientSecret: configService.get('GITHUB_CLIENT_SECRET') as string,
      },
    ],
  };
};
