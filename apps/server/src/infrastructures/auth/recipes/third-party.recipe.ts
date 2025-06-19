import { ConfigService } from '@nestjs/config';
import ThirdParty from 'supertokens-node/recipe/thirdparty';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateUserCommand } from '@/application/user/commands/create-user.command';
import { deleteUser } from 'supertokens-node';
import { Result } from '@/shared/result';
import { User } from '@/domain/user/user.entity';
import { CreateProfileCommand } from '@/application/profile/commands/create-profile.command';
import { DeleteUserCommand } from '@/application/user/commands/delete-user.command';
import { CreateUserGhTokenCommand } from '@/application/github/commands/create-user-gh-token.command';
import { UpdateUserGhTokenCommand } from '@/application/github/commands/update-user-gh-token.command';
import { SocialLinkType } from '@/domain/profile/social-link.vo';

export const thirdPartyRecipe = ({
  configService,
  commandBus,
  queryBus,
}: {
  configService: ConfigService;
  commandBus: CommandBus;
  queryBus: QueryBus;
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
      functions: (originalImplementation) => {
        return {
          ...originalImplementation,
          signInUp: async (input) => {
            const response = await originalImplementation.signInUp(input);

            if (response.status === 'OK') {
              // await deleteUser(response.user.id);
              const githubUserInfo =
                response.rawUserInfoFromProvider.fromUserInfoAPI;
              console.log({ githubUserInfo });
              const { id, emails } = response.user;
              if (response.createdNewRecipeUser) {
                try {
                  const createUserCommand = new CreateUserCommand(
                    id,
                    githubUserInfo?.user.login as string,
                    emails[0],
                  );

                  const socialLinksData: { type: string; url: string }[] = [];
                  if (githubUserInfo?.user.html_url) {
                    socialLinksData.push({
                      type: 'github',
                      url: githubUserInfo.user.html_url,
                    });
                  }
                  if (githubUserInfo?.user.twitter_username) {
                    socialLinksData.push({
                      type: 'twitter',
                      url: `https://x.com/${githubUserInfo.user.twitter_username}`,
                    });
                  }
                  if (githubUserInfo?.user.blog) {
                    socialLinksData.push({
                      type: 'website',
                      url: githubUserInfo.user.blog,
                    });
                  }

                  const createProfileCommand = new CreateProfileCommand({
                    userId: id,
                    name:
                      githubUserInfo?.user.name || githubUserInfo?.user.login,
                    avatarUrl: githubUserInfo?.user.avatar_url as string,
                    bio: githubUserInfo?.user.bio as string,
                    location: githubUserInfo?.user.location as string,
                    company: githubUserInfo?.user.company as string,
                    socialLinks: socialLinksData,
                    experiences: [],
                  });

                  const newUserResult =
                    await commandBus.execute(createUserCommand);
                  if (!newUserResult.success) {
                    console.log({ newUserResult });
                    await commandBus.execute(new DeleteUserCommand(id));

                    await deleteUser(id);
                    throw new Error('Failed to create user');
                  }

                  const newProfileResult =
                    await commandBus.execute(createProfileCommand);
                  if (!newProfileResult.success) {
                    await commandBus.execute(new DeleteUserCommand(id));
                    await deleteUser(id);
                    throw new Error(
                      `Failed to create profile: ${newProfileResult.error}`,
                    );
                  }

                  const createUserGhTokenCommand = new CreateUserGhTokenCommand(
                    id,
                    String(githubUserInfo?.user.id),
                    response?.oAuthTokens.access_token,
                  );
                  console.log({ createUserGhTokenCommand });
                  await commandBus.execute(createUserGhTokenCommand);
                } catch (error) {
                  console.error('Error during sign up process:', error);
                  await deleteUser(id);
                }
              } else {
                const saveUserGhTokenCommand = new UpdateUserGhTokenCommand(
                  id,
                  String(githubUserInfo?.user.id),
                  response?.oAuthTokens.access_token,
                );

                await commandBus.execute(saveUserGhTokenCommand);
              }
            }
            return response;
          },
        };
      },
    },
  });
};
