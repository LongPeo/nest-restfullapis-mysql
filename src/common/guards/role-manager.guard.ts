import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ACCESS_ALL } from '../constant';

@Injectable()
export class RoleManagerGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) {
      return Promise.resolve(true);
    }

    const request = context.switchToHttp().getRequest();
    const access = request.account.access;
    if (access.includes(ACCESS_ALL)) {
      return true;
    }

    return roles.some((v) => access.indexOf(v) > -1);
  }
}
