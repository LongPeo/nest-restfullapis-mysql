import { IsNotEmpty, IsNumberString, IsOptional, IsIn } from 'class-validator';
import { ACCOUNT_ACTIVE, ACCOUNT_INACTIVE } from '../../common/constant';

export class SearchRequest {
  @IsNotEmpty()
  @IsNumberString()
  page: string;

  @IsNotEmpty()
  @IsNumberString()
  limit: string;

  @IsOptional()
  @IsIn([ACCOUNT_ACTIVE, ACCOUNT_INACTIVE])
  status: string;

  @IsOptional()
  email: string;

  @IsOptional()
  mobile: string;
}
