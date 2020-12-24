import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { EncryptionModule } from '../common/services/encryption.module';
import { TokenModule } from '../common/services/token.module';
import { StaffModule } from '../staff/staff.module';

@Module({
  imports: [EncryptionModule, TokenModule, StaffModule],
  providers: [AuthService],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
