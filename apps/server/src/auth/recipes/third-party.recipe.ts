// import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import ThirdParty from 'supertokens-node/recipe/thirdparty';
import { CommandBus } from '@nestjs/cqrs';
// import { CreateUserCommand } from '@/contexts/user/use-cases/commands/create-user.command';
import { deleteUser } from 'supertokens-node';
// import { Result } from '@/libs/result';
// import { User } from '@/contexts/user/domain/user.entity';
// import { DeleteUserCommand } from '@/contexts/user/use-cases/commands/delete-user.command';
// import { CreateUserGhTokenCommand } from '@/contexts/github/use-cases/commands/create-user-gh-token.command';
// import { UpdateUserGhTokenCommand } from '@/contexts/github/use-cases/commands/update-user-gh-token.command';
import { handleGoogleSignUp } from './google/google-signInUp';
import { handleGithubSignUp } from './github/github-signInUp';
import { googleProviderConfig } from './google/google-provider.config';
import { githubProviderConfig } from './github/github-provider.config';
import { UpdateUserGhTokenCommand } from '@/contexts/github/use-cases/commands/update-user-gh-token.command';

interface GithubUserInfo {
  user: {
    login: string;
    id: number;
    name: string | null;
    avatar_url: string;
    bio: string | null;
    location: string | null;
    company: string | null;
    html_url: string;
    twitter_username: string | null;
    blog: string | null;
  };
}

export const thirdPartyRecipe = ({
  configService,
  commandBus,
}: {
  configService: ConfigService;
  commandBus: CommandBus;
}) => {
  return ThirdParty.init({
    signInAndUpFeature: {
      providers: [
        {
          config: googleProviderConfig(configService),
        },
        {
          config: githubProviderConfig(configService),
        },
      ],
    },
    override: {
      apis: (originalImplementation) => {
        return {
          ...originalImplementation,
          authorisationUrlGET: async (input) => {
            if (
              typeof originalImplementation.authorisationUrlGET !== 'function'
            ) {
              throw new Error('authorisationURLGet is not implemented');
            }

            const response =
              await originalImplementation.authorisationUrlGET(input);
            if (response.status === 'OK' && input.provider.id === 'github') {
              response.urlWithQueryParams += '&prompt=select_account';
            }
            return response;
          },
        };
      },
      functions: (originalImplementation) => {
        return {
          ...originalImplementation,
          signInUp: async (input) => {
            const response = await originalImplementation.signInUp(input);

            if (response.status === 'OK') {
              if (input.thirdPartyId === 'github') {
                const { id, emails } = response.user;
                const githubUserInfo = response.rawUserInfoFromProvider
                  .fromUserInfoAPI as GithubUserInfo | undefined;
                // const { user: githubUser } = githubUserInfo;
                if (!githubUserInfo?.user) {
                  if (response.createdNewRecipeUser) {
                    await deleteUser(response.user.id);
                  }
                  throw new Error(
                    'Failed to retrieve user information from GitHub.',
                  );
                }
                if (response.createdNewRecipeUser) {
                  const userInfo = {
                    id,
                    email: emails[0],
                    githubUser: githubUserInfo.user,
                    response: {
                      oAuthTokens: {
                        access_token: response.oAuthTokens
                          .access_token as string,
                      },
                    },
                  };
                  await handleGithubSignUp(userInfo, commandBus);
                } else {
                  const accessToken = response?.oAuthTokens
                    .access_token as string;
                  if (typeof accessToken === 'string') {
                    const saveUserGhTokenCommand = new UpdateUserGhTokenCommand(
                      id,
                      String(githubUserInfo.user.id),
                      accessToken,
                    );
                    await commandBus.execute(saveUserGhTokenCommand);
                  }
                }
              }

              // Traiter seulement les nouveaux utilisateurs
              if (input.thirdPartyId === 'google') {
                const { picture, email } = response.rawUserInfoFromProvider
                  .fromUserInfoAPI as {
                  picture: string;
                  email: string;
                };
                const userInfo = {
                  id: response.user.id,
                  email,
                  // provider: 'google',
                  picture,
                };
                await handleGoogleSignUp(userInfo, commandBus);
              }
            }
            // if (response.status === 'OK') {
            //   const githubUserInfo = response.rawUserInfoFromProvider
            //     .fromUserInfoAPI as GithubUserInfo | undefined;

            //   if (!githubUserInfo?.user) {
            //     if (response.createdNewRecipeUser) {
            //       await deleteUser(response.user.id);
            //     }
            //     throw new Error(
            //       'Failed to retrieve user information from GitHub.',
            //     );
            //   }
            //   const { user: githubUser } = githubUserInfo;
            //   const { id, emails } = response.user;
            //   if (response.createdNewRecipeUser) {
            //     try {
            //       const createUserCommand = new CreateUserCommand({
            //         id,
            //         username: githubUser.login,
            //         email: emails[0],
            //         name: githubUser.name || githubUser.login,
            //         login: githubUser.login,
            //         avatarUrl: githubUser.avatar_url,
            //         bio: githubUser.bio ?? '',
            //       });

            //       const socialLinksData: { type: string; url: string }[] = [];
            //       if (githubUser.html_url) {
            //         socialLinksData.push({
            //           type: 'github',
            //           url: githubUser.html_url,
            //         });
            //       }
            //       if (githubUser.twitter_username) {
            //         socialLinksData.push({
            //           type: 'twitter',
            //           url: `https://x.com/${githubUser.twitter_username}`,
            //         });
            //       }
            //       if (githubUser.blog) {
            //         socialLinksData.push({
            //           type: 'website',
            //           url: githubUser.blog,
            //         });
            //       }

            //       const newUserResult: Result<User> =
            //         await commandBus.execute(createUserCommand);
            //       if (!newUserResult.success) {
            //         Logger.log({ newUserResult });
            //         await commandBus.execute(new DeleteUserCommand(id));

            //         await deleteUser(id);
            //         throw new Error(newUserResult.error);
            //       }

            //       const accessToken = response?.oAuthTokens
            //         .access_token as string;
            //       if (typeof accessToken !== 'string') {
            //         throw new Error('Invalid GitHub access token received');
            //       }

            //       const createUserGhTokenCommand = new CreateUserGhTokenCommand(
            //         {
            //           userId: id,
            //           githubUserId: String(githubUser.id),
            //           githubAccessToken: accessToken,
            //         },
            //       );
            //       await commandBus.execute(createUserGhTokenCommand);
            //     } catch (error) {
            //       Logger.error('Error during sign up process:', error);
            //       await deleteUser(id);
            //     }
            //   } else {
            //     const accessToken = response?.oAuthTokens
            //       .access_token as string;
            //     if (typeof accessToken === 'string') {
            //       const saveUserGhTokenCommand = new UpdateUserGhTokenCommand(
            //         id,
            //         String(githubUser.id),
            //         accessToken,
            //       );

            //       await commandBus.execute(saveUserGhTokenCommand);
            //     }
            //   }
            // }
            return response;
          },
        };
      },
    },
  });
};
