import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { TokenService } from '../services/token.service';
import { StaffService } from '../../staff/staff.service';
import {
  ACCOUNT_ACTIVE,
  ERROR_LOGIN_OTHER_DEVICE,
  ERROR_STATUS_USER_CHANGED,
} from '../constant';
import { RoleService } from '../../role/role.service';

@Injectable()
export class AuthManagerGuard implements CanActivate {
  constructor(
    private readonly tokenService: TokenService,
    private readonly staffService: StaffService,
    private readonly roleService: RoleService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { authorization } = request.headers;
    if (!authorization) {
      throw new BadRequestException('Authorization header is required');
    }
    const accessToken: string = authorization.split(' ')[1];

    try {
      const account: any = await this.tokenService.verifyToken(accessToken);
      const { jti, status, roleId } = await this.staffService.findOne(
        account.id,
      );
      if (status !== ACCOUNT_ACTIVE) {
        throw new BadRequestException(ERROR_STATUS_USER_CHANGED);
      }
      if (jti !== account.jti) {
        throw new BadRequestException(ERROR_LOGIN_OTHER_DEVICE);
      }
      const role = await this.roleService.findOne(roleId);
      if (!role) {
        throw new NotFoundException('Không tìm thấy Role');
      }
      request.account = account;
      request.account.access = role.access;

      return true;
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new UnauthorizedException(error.message);
      }
      throw error;
    }
  }
}
