import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Use auth.guard before run this decorator.
 */
export const UserDecorator = createParamDecorator(
  (key: string = null, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    return key ? user && user[key] : user;
  },
);
