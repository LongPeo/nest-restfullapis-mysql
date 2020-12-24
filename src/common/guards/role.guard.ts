import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) {
      return Promise.resolve(true);
    }

    const request = context.switchToHttp().getRequest();
    const roleCode = request.account.roleCode;

    return roles.some((v) => roleCode.indexOf(v) > -1);
  }
}
