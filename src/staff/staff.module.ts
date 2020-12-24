import { Module } from '@nestjs/common';
import { StaffService } from './staff.service';
import { Staff } from './staff.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TokenModule } from '../common/services/token.module';
import { EncryptionModule } from '../common/services/encryption.module';
import { StaffManagerController } from './staff-manager.controller';
import { StaffController } from './staff.controller';
import { Role } from '../role/role.entity';
import { RoleService } from '../role/role.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Staff, Role]),
    TokenModule,
    EncryptionModule,
  ],
  providers: [StaffService, RoleService],
  exports: [StaffService],
  controllers: [StaffManagerController, StaffController],
})
export class StaffModule {}
