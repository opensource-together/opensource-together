import EmailPassword from 'supertokens-node/recipe/emailpassword';
import { Result } from '@/libs/result';
import { Email } from '@/contexts/user/domain/email.vo';
import { Username } from '@/contexts/user/domain/username.vo';
import { UserExistQuery } from '@/contexts/user/use-cases/queries/user-exist.query';
import { CreateUserCommand } from '@/contexts/user/use-cases/commands/create-user.command';
import { User } from '@/contexts/user/domain/user.entity';
import { FindUserByUsernameQuery } from '@/contexts/user/use-cases/queries/find-user-by-username.query';
import { deleteUser } from 'supertokens-node';
import { QueryBus } from '@nestjs/cqrs';
import { CommandBus } from '@nestjs/cqrs';

export const emailPasswordRecipe = (
  queryBus: QueryBus,
  commandBus: CommandBus,
) =>
  EmailPassword.init({
    signUpFeature: {
      formFields: [
        {
          id: 'email', //sert en realite à la validation du username
          validate: async (value): Promise<string | undefined> => {
            if (typeof value !== 'string') {
              return 'Please provide a string input.';
            }
            // first we check for if it's an email
            const validEmail: Result<Email> = Email.create(value);
            if (!validEmail.success) {
              console.log({ value });
              const validUsername: Result<Username> = Username.create(value);
              if (validUsername.success) {
                return undefined;
              } else {
                return Promise.resolve(validUsername.error);
              }
            }
            // since it's not an email, we check for if it's a correct username
          },
        },
        {
          id: 'actualEmail', //sert à la vrai validation de l'email
          validate: async (value): Promise<string | undefined> => {
            if (typeof value !== 'string') {
              return 'Please provide a string input.';
            }
            const validEmail: Result<Email> = Email.create(value);
            if (validEmail.success) {
              return undefined;
            } else {
              return Promise.resolve(validEmail.error);
            }
          },
        },
      ],
    },
    override: {
      apis: (original) => ({
        ...original,
        async signUpPOST(input) {
          const actualEmailFromInput = input.formFields.find(
            (f) => f.id === 'actualEmail',
          )?.value as string;
          const usernameFromInput = input.formFields.find(
            (f) => f.id === 'email',
          )?.value as string;
          const userExist: boolean = await queryBus.execute(
            new UserExistQuery(usernameFromInput, actualEmailFromInput),
          );
          if (userExist) {
            return {
              status: 'GENERAL_ERROR',
              message: 'La création du compte a échoué. Veuillez réessayer.',
            };
          }
          const adaptedInputForSuperTokens = { ...input };

          adaptedInputForSuperTokens.formFields =
            adaptedInputForSuperTokens.formFields.map((field) => {
              if (field.id === 'email') {
                return { ...field, value: actualEmailFromInput };
              }
              return field;
            });

          const responseSignUpPOSTSupertokens = await original.signUpPOST!(
            adaptedInputForSuperTokens,
          );
          if (responseSignUpPOSTSupertokens.status === 'OK') {
            const usernameForCreateUser = input.formFields.find(
              (f) => f.id === 'email',
            )?.value as string;
            const emailForCreateUser = input.formFields.find(
              (f) => f.id === 'actualEmail',
            )?.value as string;

            const createUserResult: Result<User> = await commandBus.execute(
              new CreateUserCommand(
                responseSignUpPOSTSupertokens.user.id,
                usernameForCreateUser,
                emailForCreateUser,
              ),
            );
            console.log(
              'je suis dans le createUserResult de signUpPOST',
              createUserResult,
            );
            if (!createUserResult.success) {
              const deleteUserResult = await deleteUser(
                responseSignUpPOSTSupertokens.user.id,
              );
              if (deleteUserResult.status === 'OK') {
                console.log(
                  'je suis dans le deleteUserResult.status === OK de signUpPOST',
                );
                return {
                  status: 'GENERAL_ERROR',
                  message: createUserResult.error,
                };
              }
            }
          }
          return responseSignUpPOSTSupertokens;
        },

        async signInPOST(input) {
          const identifier = input.formFields.find((f) => f.id === 'email')
            ?.value as string;
          //si c'est un email
          const validEmail: Result<Email> = Email.create(identifier);
          if (validEmail.success) {
            const responseSignInPOST = await original.signInPOST!(input);
            if (responseSignInPOST.status === 'WRONG_CREDENTIALS_ERROR') {
              console.log(
                'je suis dans le WRONG_CREDENTIALS_ERROR de signInPOST',
              );
              return {
                status: 'GENERAL_ERROR',
                message: 'Identifiants incorrects.',
              };
            }
            return responseSignInPOST;
          }

          //si l'identifiant est un username, on cherche l'email associé
          const user: Result<User> = await queryBus.execute(
            new FindUserByUsernameQuery(identifier),
          );
          console.log({ user });
          if (!user.success) {
            return {
              status: 'GENERAL_ERROR',
              message: 'Identifiants incorrects.',
            };
          }
          input.formFields = input.formFields.map((field) => {
            if (field.id === 'email') {
              return { ...field, value: user.value.toPrimitive().email };
            }
            return field;
          });
          const responseSignInPOST = await original.signInPOST!(input);
          if (responseSignInPOST.status === 'WRONG_CREDENTIALS_ERROR') {
            return {
              status: 'GENERAL_ERROR',
              message: 'Identifiants incorrects.',
            };
          }
          return responseSignInPOST;
        },
      }),
    },
  });
