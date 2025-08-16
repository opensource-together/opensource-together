import { ConfigService } from '@nestjs/config';

export const googleProviderConfig = (configService: ConfigService) => {
  return {
    thirdPartyId: 'google',
    clients: [
      {
        clientId: configService.get('GOOGLE_CLIENT_ID') as string,
        clientSecret: configService.get('GOOGLE_CLIENT_SECRET') as string,
      },
    ],
  };
};
