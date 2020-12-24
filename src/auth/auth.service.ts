import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { EncryptionService } from '../common/services/encryption.service';
import { TokenService } from '../common/services/token.service';
import { TokenResponse } from './auth.interface';
import { StaffService } from '../staff/staff.service';
import { ACCOUNT_INACTIVE } from '../common/constant';

@Injectable()
export class AuthService {
  constructor(
    private readonly encryptionService: EncryptionService,
    private readonly tokenService: TokenService,
    private readonly staffService: StaffService,
  ) {}

  async loginManager({ email, password }): Promise<TokenResponse> {
    const staff = await this.staffService.findOne({ email });
    if (!staff) {
      throw new NotFoundException('Không tìm thấy email!');
    }
    if (staff.status === ACCOUNT_INACTIVE) {
      throw new BadRequestException('Tài khoản chưa được kích hoạt!');
    }
    const isValid = this.encryptionService.isValidPassword(
      password,
      staff.salt,
      staff.password,
    );
    if (!isValid) {
      throw new BadRequestException('Password không chính xác!');
    }
    staff.jti = uuidv4();
    await this.staffService.update(staff.id, staff);
    const accessToken = await this.tokenService.generateToken(staff);
    const refreshToken = await this.tokenService.generateRefreshToken(staff);

    return {
      accessToken,
      refreshToken,
    };
  }

  async refreshTokenManager(refreshToken: string): Promise<TokenResponse> {
    const decoded: any = await this.tokenService.verifyRefreshToken(
      refreshToken,
    );
    const staff = await this.staffService.findOneOrFail(decoded.id);

    const accessToken = await this.tokenService.generateToken(staff);
    const refresh = await this.tokenService.generateRefreshToken(staff);
    await this.staffService.update(staff.id, staff);

    return {
      accessToken,
      refreshToken: refresh,
    };
  }
}
