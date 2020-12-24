import {
  Controller,
  Get,
  UseInterceptors,
  UseGuards,
  Post,
  Body,
  Put,
  HttpCode,
  InternalServerErrorException,
  Param,
  Query,
  Delete,
} from '@nestjs/common';
import { StaffService } from './staff.service';
import { ExceptionInterceptor } from '../common/interceptors/exception.interceptor';
import { AuthManagerGuard } from '../common/guards/auth-manager.guard';
import { RoleManagerGuard } from '../common/guards/role-manager.guard';
import { Roles } from '../common/decorators/role-decorator';
import { StaffRequest, SearchRequest, UpdateStaffRequest } from './dto';
import {
  CreateStaffResponse,
  SearchPaginationResponse,
} from './staff.interface';
import { Staff } from './staff.entity';
import { UserDecorator } from '../common/decorators/user-decorator';
import { ACCESS_ROLE, ACCESS_STAFF } from '../common/constant';

@Controller('manager/staffs')
@UseGuards(AuthManagerGuard, RoleManagerGuard)
@UseInterceptors(ExceptionInterceptor)
export class StaffManagerController {
  constructor(private readonly staffService: StaffService) {}

  @Get()
  @Roles(ACCESS_ROLE, ACCESS_STAFF)
  async findPagination(
    @Query() query: SearchRequest,
  ): Promise<SearchPaginationResponse> {
    const [staffs, totalCount] = await this.staffService.findAndCount(query);
    return {
      data: staffs,
      totalCount,
    };
  }

  @Post()
  @Roles(ACCESS_ROLE)
  async create(@Body() body: StaffRequest): Promise<CreateStaffResponse> {
    const created = await this.staffService.create(body);
    return created && created.raw && created.raw[0] ? created.raw[0] : created;
  }

  @Get(':id')
  @Roles(ACCESS_ROLE)
  getStaff(@Param('id') id: number): Promise<Staff> {
    return this.staffService.getById(id);
  }

  @Put(':id')
  @HttpCode(204)
  @Roles(ACCESS_ROLE)
  async update(
    @Param('id') id: number,
    @Body() body: UpdateStaffRequest,
  ): Promise<boolean> {
    const updated = await this.staffService.update(id, body);
    if (updated.affected < 1) {
      throw new InternalServerErrorException(`cannot update with id ${id}!`);
    }
    return true;
  }

  @Delete(':id')
  @Roles(ACCESS_ROLE)
  async delete(
    @UserDecorator() profile,
    @Param('id') id: number,
  ): Promise<boolean> {
    if (profile.id == id) {
      throw new InternalServerErrorException('Không thể xoá chính mình');
    }

    await this.staffService.delete(id);

    return true;
  }
}
