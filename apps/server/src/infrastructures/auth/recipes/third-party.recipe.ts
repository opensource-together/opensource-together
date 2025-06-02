import { ConfigService } from '@nestjs/config';
import ThirdParty from 'supertokens-node/recipe/thirdparty';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateUserCommand } from '@/application/user/commands/create-user.command';
import { deleteUser } from 'supertokens-node';
import { Result } from '@/shared/result';
import { User } from '@/domain/user/user.entity';
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
                scope: ['repo', 'user:email', 'read:user'],
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
            // Post sign up response, we check if it was successful
            if (response.status === 'OK') {
              const githubUserInfo =
                response.rawUserInfoFromProvider.fromUserInfoAPI;
              const { id, emails } = response.user;
              if (response.createdNewRecipeUser) {
                console.log('create new user');
                console.log({ id });
                console.log({ response });
                const createUserCommand = new CreateUserCommand(
                  id,
                  githubUserInfo?.user.login,
                  emails[0],
                );
                const newUser: Result<
                  User,
                  { username?: string; email?: string } | string
                > = await commandBus.execute(createUserCommand);
                console.log({ newUser });
                if (newUser.success) {
                  console.log({ newUser });
                } else {
                  console.log('Je rentre dans le else');
                  await deleteUser(id);
                }
                return response;

                // try {
                //   const createUserCommand = new CreateUserCommand(
                //     id,
                //     githubUserInfo?.user.login,
                //     emails[0],
                //   );
                //   const newUser: Result<
                //     User,
                //     { username?: string; email?: string } | string
                //   > = await commandBus.execute(createUserCommand);
                //   if (newUser.success) {
                //     console.log({ newUser });
                //   } else {
                //     await deleteUser(id);
                //   }
                //   return response;
                // } catch (err) {
                //   console.log('Je rentre dans catch');
                //   console.log({ err });
                //   await deleteUser(id);
                // }
              }

              // This is the response from the OAuth 2 provider that contains their tokens or user info.
              //   const providerAccessToken = response.oAuthTokens['access_token'];
              //   const firstName =
              //     response.rawUserInfoFromProvider.fromUserInfoAPI!['first_name'];

              //   if (input.session === undefined) {
              //     if (
              //       response.createdNewRecipeUser &&
              //       response.user.loginMethods.length === 1
              //     ) {
              //       // TODO: Post sign up logic
              //     } else {
              //       // TODO: Post sign in logic
              //     }
              //   }
            }
            return response;
          },
        };
      },
    },
  });
};
