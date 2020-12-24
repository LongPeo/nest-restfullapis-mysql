import { Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { Role } from './role.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TokenModule } from '../common/services/token.module';
import { EncryptionModule } from '../common/services/encryption.module';
import { RoleManagerController } from './role-manager.controller';
import { StaffService } from '../staff/staff.service';
import { Staff } from '../staff/staff.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Role, Staff]),
    TokenModule,
    EncryptionModule,
  ],
  providers: [RoleService, StaffService],
  exports: [RoleService],
  controllers: [RoleManagerController],
})
export class RoleModule {}
