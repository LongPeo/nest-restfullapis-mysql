import { Controller, Post, UseInterceptors, Body, Res } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { ExceptionInterceptor } from '../common/interceptors/exception.interceptor';
import { LoginRequest } from './dto';
import { TokenResponse } from './auth.interface';
import { Cookies } from '../common/decorators/cookie-decorator';

@Controller()
@UseInterceptors(ExceptionInterceptor)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login-manager')
  async loginManager(
    @Body() body: LoginRequest,
    @Res() response: Response,
  ): Promise<any> {
    const { accessToken, refreshToken } = await this.authService.loginManager(
      body,
    );
    return response.cookie('refreshToken', refreshToken).send({ accessToken });
  }

  @Post('refresh-token-manager')
  async refreshTokenManager(
    @Cookies() cookies: TokenResponse,
    @Res() response: Response,
  ): Promise<any> {
    const {
      accessToken,
      refreshToken,
    } = await this.authService.refreshTokenManager(cookies.refreshToken);
    return response.cookie('refreshToken', refreshToken).send({ accessToken });
  }
}
