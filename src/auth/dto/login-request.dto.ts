import { IsNotEmpty, IsEmail } from 'class-validator';

export class LoginRequest {
  @IsNotEmpty()
  @IsEmail({}, { message: 'Email không hợp lệ' })
  email: string;

  @IsNotEmpty()
  password: string;
}
