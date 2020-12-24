// import { ACCOUNT_TYPE_PERSONAL } from '../constant';
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
// import { UserService } from '../../user/user.service';

@Injectable()
export class AuthGuard implements CanActivate {
  // constructor(private readonly userService: UserService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { authorization } = request.headers;
    if (!authorization) {
      throw new BadRequestException('Authorization header is requied');
    }

    try {
      // const user = await this.userService.findOne({
      //   email: userFirebase.email,
      // });
      // request.user = {
      //   email: userFirebase.email,
      //   id: user && user.id ? user.id : null,
      //   type: user && user.type ? user.type : ACCOUNT_TYPE_PERSONAL,
      //   displayName:
      //     user && user.firstName && user.lastName
      //       ? `${[user.firstName, user.lastName].join(' ')}`
      //       : userFirebase.name,
      //   mobile: user && user.mobile ? user.mobile : null,
      //   street: user ? user.street : undefined,
      //   state: user ? user.state : undefined,
      //   city: user ? user.city : undefined,
      //   postcode: user ? user.postcode : undefined,
      // };

      return true;
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new UnauthorizedException(error.message);
      }
      throw new BadRequestException(error.message);
    }
  }
}
