import { ConfigService } from '@nestjs/config';
import ThirdParty from 'supertokens-node/recipe/thirdparty';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateUserCommand } from '@/application/user/commands/create-user.command';
import { deleteUser } from 'supertokens-node';
import { Result } from '@/shared/result';
import { User } from '@/domain/user/user.entity';
import { UpdateGithubTokenUserCommand } from '@/application/user/commands/update-user-gh-token.command';
import { GithubUserInfoDto } from './dto/github-user-info.dto';
export const thirdPartyRecipe = ({
  configService,
  commandBus,
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
              const githubUserInfo = response.rawUserInfoFromProvider
                .fromUserInfoAPI as GithubUserInfoDto | undefined;
              if (!githubUserInfo) {
                // TODO handle missing user info
                throw Error(`Missing user info during authentication`);
              }
              console.log({ githubUserInfo });
              const { id, emails } = response.user;
              const accessToken = response.oAuthTokens.access_token as string;
              if (response.createdNewRecipeUser) {
                const createUserCommand = new CreateUserCommand(
                  id,
                  githubUserInfo.login,
                  emails[0],
                  githubUserInfo.avatar_url,
                  githubUserInfo.bio,
                  githubUserInfo.html_url,
                  String(githubUserInfo.id),
                  accessToken,
                );
                const newUser: Result<
                  User,
                  { username?: string; email?: string } | string
                > = await commandBus.execute(createUserCommand);
                if (!newUser.success) {
                  console.log({ newUser });
                  await deleteUser(id);
                }
              } else {
                console.log('update user');
                const updateUserCommand = new UpdateGithubTokenUserCommand(
                  id,
                  String(githubUserInfo.id),
                  accessToken,
                );
                await commandBus.execute(updateUserCommand);
              }
            }
            return response;
          },
        };
      },
    },
  });
};
