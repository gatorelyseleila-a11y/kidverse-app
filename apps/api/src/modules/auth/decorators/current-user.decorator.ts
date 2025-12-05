import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Récupérer l'utilisateur connecté depuis la requête
 */
export const CurrentUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    // If a specific property is requested, return just that property
    if (data) {
      return user?.[data];
    }

    return user;
  },
);


