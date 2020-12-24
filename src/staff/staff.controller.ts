import {
  Controller,
  Get,
  UseInterceptors,
  UseGuards,
  Body,
  Put,
  HttpCode,
  InternalServerErrorException,
  Patch,
} from '@nestjs/common';
import { StaffService } from './staff.service';
import { Staff } from './staff.entity';
import { ExceptionInterceptor } from '../common/interceptors/exception.interceptor';
import { AuthManagerGuard } from '../common/guards/auth-manager.guard';
import { StaffDecorator } from '../common/decorators/staff-decorator';
import { UpdateStaffRequest, UpdatePasswordRequest } from './dto';

@Controller('staffs')
@UseGuards(AuthManagerGuard)
@UseInterceptors(ExceptionInterceptor)
export class StaffController {
  constructor(private readonly staffService: StaffService) {}

  @Get('profile')
  getProfile(@StaffDecorator() staff): Promise<Staff> {
    return this.staffService.getById(staff.id);
  }

  @Put('profile')
  @HttpCode(204)
  async updateProfile(
    @StaffDecorator() staff,
    @Body() body: UpdateStaffRequest,
  ): Promise<boolean> {
    const updated = await this.staffService.update(staff.id, body);
    if (updated.affected < 1) {
      throw new InternalServerErrorException(
        `cannot update with id ${staff.id}!`,
      );
    }
    return true;
  }

  @Patch('password')
  @HttpCode(204)
  async updatePassword(
    @StaffDecorator() staff,
    @Body() body: UpdatePasswordRequest,
  ): Promise<boolean> {
    const updated = await this.staffService.updatePassword(staff.id, body);
    if (updated.affected < 1) {
      throw new InternalServerErrorException(
        `cannot update with id ${staff.id}!`,
      );
    }
    return true;
  }
}
