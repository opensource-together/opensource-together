import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { getSession } from 'supertokens-node/recipe/session';
import { Request, Response } from 'express';

/**
 * Récupère le userId de la session SuperTokens, si elle existe.
 * Retourne undefined sinon.
 */
export const OptionalSession = createParamDecorator(
  async (
    _data: unknown,
    ctx: ExecutionContext,
  ): Promise<string | undefined> => {
    const request = ctx.switchToHttp().getRequest<Request>();
    const response = ctx.switchToHttp().getResponse<Response>();

    try {
      const session = await getSession(request, response);
      return session.getUserId();
    } catch (_) {
      return undefined; // Pas de session : on renvoie undefined
    }
  },
);
