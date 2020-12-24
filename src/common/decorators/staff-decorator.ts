import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Use auth.guard before run this decorator.
 */
export const StaffDecorator = createParamDecorator(
  (key: string = null, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const staff = request.account;

    return key ? staff && staff[key] : staff;
  },
);
