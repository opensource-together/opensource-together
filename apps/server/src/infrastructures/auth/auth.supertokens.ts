// import { AuthServicePort } from '@/application/auth/ports/auth.service.port';
// import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
// import EmailPassword from 'supertokens-node/recipe/emailpassword';
// import { Result } from '@shared/result';
// @Injectable()
// export class AuthSupertokens implements AuthServicePort {
//   async signIn(
//     email: string,
//     password: string,
//   ): Promise<Result<{ userId: string; authProviderResponse: any }, string>> {
//     const result = await EmailPassword.signIn('public', email, password);
//     if (result.status === 'WRONG_CREDENTIALS_ERROR') {
//       throw new HttpException(
//         'Identifiants invalides',
//         HttpStatus.UNAUTHORIZED,
//       );
//     }
//     return Result.ok({ userId: result.user.id, authProviderResponse: result });
//   }

//   async signUp({
//     email,
//     password,
//   }: {
//     email: string;
//     password: string;
//   }): Promise<Result<{ userId: string; authProviderResponse: any }, string>> {
//     const result = await EmailPassword.signUp('public', email, password);
//     if (result.status === 'EMAIL_ALREADY_EXISTS_ERROR') {
//       throw new HttpException(
//         'Une erreur est survenue lors de la création de votre compte',
//         HttpStatus.BAD_REQUEST,
//       );
//     }
//     return Result.ok({ userId: result.user.id, authProviderResponse: result });
//   }
// }
