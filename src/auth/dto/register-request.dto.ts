import { IsNotEmpty, IsEmail, IsOptional, IsNumber } from 'class-validator';

export class RegisterRequest {
  @IsOptional()
  firstName: string;

  @IsOptional()
  lastName: string;

  @IsNotEmpty()
  @IsEmail({}, { message: 'Email không hợp lệ' })
  email: string;

  @IsNotEmpty()
  password: string;

  @IsOptional()
  @IsNumber()
  referrerId: number;
}
