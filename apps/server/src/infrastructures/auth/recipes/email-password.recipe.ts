import EmailPassword from 'supertokens-node/recipe/emailpassword';
import { Result } from '@shared/result';
import { Email } from '@domain/user/email.vo';
import { Username } from '@domain/user/username.vo';

export const emailPasswordRecipe = () =>
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
        disableSignUpPOST: true,
        disableSignInPOST: true,
        signUpPOST: undefined,
        signInPOST: undefined,
        /*
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
            if (!createUserResult.success) {
              const deleteUserResult = await deleteUser(
                responseSignUpPOSTSupertokens.user.id,
              );
              if (deleteUserResult.status === 'OK') {
                return {
                  status: 'GENERAL_ERROR',
                  message: createUserResult.error,
                };
              }
            }
          }
          return responseSignUpPOSTSupertokens;
        },

        */
        /*
        async signInPOST(input) {
          const identifier = input.formFields.find((f) => f.id === 'email')
            ?.value as string;
          //si c'est un email
          const validEmail: Result<Email> = Email.create(identifier);
          if (validEmail.success) {
            const responseSignInPOST = await original.signInPOST!(input);
            if (responseSignInPOST.status === 'WRONG_CREDENTIALS_ERROR') {
              return {
                status: 'GENERAL_ERROR',
                message: 'Identifiants incorrects.',
              };
            }
            return responseSignInPOST;
          }

          //si l'identifiant est un username, on cherche l'email associé
          const email: Result<string> = await queryBus.execute(
            new FindEmailByUsernameQuery(identifier),
          );
          if (!email.success) {
            return {
              status: 'GENERAL_ERROR',
              message: 'Identifiants incorrects.',
            };
          }
          input.formFields = input.formFields.map((field) => {
            if (field.id === 'email') {
              return { ...field, value: email.value };
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
        */
      }),
    },
  });
