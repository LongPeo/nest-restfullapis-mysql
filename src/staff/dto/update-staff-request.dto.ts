import {
  IsOptional,
  IsIn,
  IsNotEmpty,
  IsEmail,
  Validate,
  IsNumber,
} from 'class-validator';
import { ACCOUNT_ACTIVE, ACCOUNT_INACTIVE } from '../../common/constant';
import { IsValidMobile } from '../../common/validators/is-valid-mobile';

export class UpdateStaffRequest {
  @IsNotEmpty()
  fullName: string;

  @IsNotEmpty()
  @IsEmail({}, { message: 'Email không hợp lệ' })
  email: string;

  @IsNotEmpty()
  @Validate(IsValidMobile)
  mobile: string;

  @IsOptional()
  @IsIn([ACCOUNT_ACTIVE, ACCOUNT_INACTIVE])
  status: string;

  @IsOptional()
  address: string;

  @IsOptional()
  @IsNumber()
  roleId: number;

  @IsOptional()
  jti: string;
}
