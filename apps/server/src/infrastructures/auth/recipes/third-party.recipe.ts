import { ConfigService } from '@nestjs/config';
import ThirdParty from 'supertokens-node/recipe/thirdparty';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateUserCommand } from '@/application/user/commands/create-user.command';
import { deleteUser } from 'supertokens-node';
import { Result } from '@/shared/result';
import { User } from '@/domain/user/user.entity';
import { UpdateUserGhTokenCommand } from '@/application/user/commands/update-user-gh-token.command';
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
            // First we call the original implementation of signInUp.
            const response = await originalImplementation.signInUp(input);

            if (response.status === 'OK') {
              //
              // await deleteUser(response.user.id);
              const githubUserInfo =
                response.rawUserInfoFromProvider.fromUserInfoAPI;
              console.log({ githubUserInfo });
              const { id, emails } = response.user;
              if (response.createdNewRecipeUser) {
                try {
                  const createUserCommand = new CreateUserCommand(
                    id,
                    githubUserInfo?.user.login,
                    emails[0],
                    githubUserInfo?.user.avatar_url,
                    githubUserInfo?.user.bio,
                    githubUserInfo?.user.html_url,
                    String(githubUserInfo?.user.id),
                    response?.oAuthTokens.access_token,
                  );
                  const newUser: Result<
                    User,
                    { username?: string; email?: string } | string
                  > = await commandBus.execute(createUserCommand);
                  if (!newUser.success) {
                    await deleteUser(id);
                  }
                } catch (error) {
                  console.log({ error });
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