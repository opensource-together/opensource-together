import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import ThirdParty from 'supertokens-node/recipe/thirdparty';
import { CommandBus } from '@nestjs/cqrs';
import { CreateUserCommand } from '@/contexts/user/use-cases/commands/create-user.command';
import { deleteUser } from 'supertokens-node';
import { Result } from '@/libs/result';
import { User } from '@/contexts/user/domain/user.entity';
import { CreateProfileCommand } from '@/contexts/profile/use-cases/commands/create-profile.command';
import { DeleteUserCommand } from '@/contexts/user/use-cases/commands/delete-user.command';
import { CreateUserGhTokenCommand } from '@/contexts/github/use-cases/commands/create-user-gh-token.command';
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
          config: {
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
                clientSecret: configService.get(
                  'GITHUB_CLIENT_SECRET',
                ) as string,
              },
            ],
          },
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
              const githubUserInfo = response.rawUserInfoFromProvider
                .fromUserInfoAPI as GithubUserInfo | undefined;

              if (!githubUserInfo?.user) {
                if (response.createdNewRecipeUser) {
                  await deleteUser(response.user.id);
                }
                throw new Error(
                  'Failed to retrieve user information from GitHub.',
                );
              }
              const { user: githubUser } = githubUserInfo;
              const { id, emails } = response.user;
              if (response.createdNewRecipeUser) {
                try {
                  const createUserCommand = new CreateUserCommand(
                    id,
                    githubUser.login,
                    emails[0],
                  );

                  const socialLinksData: { type: string; url: string }[] = [];
                  if (githubUser.html_url) {
                    socialLinksData.push({
                      type: 'github',
                      url: githubUser.html_url,
                    });
                  }
                  if (githubUser.twitter_username) {
                    socialLinksData.push({
                      type: 'twitter',
                      url: `https://x.com/${githubUser.twitter_username}`,
                    });
                  }
                  if (githubUser.blog) {
                    socialLinksData.push({
                      type: 'website',
                      url: githubUser.blog,
                    });
                  }

                  const createProfileCommand = new CreateProfileCommand({
                    userId: id,
                    name: githubUser.name || githubUser.login,
                    login: githubUser.login,
                    avatarUrl: githubUser.avatar_url,
                    bio: githubUser.bio ?? '',
                    location: githubUser.location ?? '',
                    company: githubUser.company ?? '',
                    socialLinks: socialLinksData,
                    experiences: [],
                  });

                  const newUserResult: Result<User> =
                    await commandBus.execute(createUserCommand);
                  if (!newUserResult.success) {
                    Logger.log({ newUserResult });
                    await commandBus.execute(new DeleteUserCommand(id));

                    await deleteUser(id);
                    throw new Error(newUserResult.error);
                  }

                  const newProfileResult: Result<any> =
                    await commandBus.execute(createProfileCommand);
                  if (!newProfileResult.success) {
                    await commandBus.execute(new DeleteUserCommand(id));
                    await deleteUser(id);
                    throw new Error(
                      `Failed to create profile: ${newProfileResult.error}`,
                    );
                  }

                  const accessToken = response?.oAuthTokens
                    .access_token as string;
                  if (typeof accessToken !== 'string') {
                    throw new Error('Invalid GitHub access token received');
                  }

                  const createUserGhTokenCommand = new CreateUserGhTokenCommand(
                    {
                      userId: id,
                      githubUserId: String(githubUser.id),
                      githubAccessToken: accessToken,
                    },
                  );
                  await commandBus.execute(createUserGhTokenCommand);
                } catch (error) {
                  Logger.error('Error during sign up process:', error);
                  await deleteUser(id);
                }
              } else {
                const accessToken = response?.oAuthTokens
                  .access_token as string;
                if (typeof accessToken === 'string') {
                  const saveUserGhTokenCommand = new UpdateUserGhTokenCommand(
                    id,
                    String(githubUser.id),
                    accessToken,
                  );

                  await commandBus.execute(saveUserGhTokenCommand);
                }
              }
            }
            return response;
          },
        };
      },
    },
  });
};
