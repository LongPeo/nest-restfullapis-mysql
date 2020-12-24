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
import { RoleService } from './role.service';
import { ExceptionInterceptor } from '../common/interceptors/exception.interceptor';
import { AuthManagerGuard } from '../common/guards/auth-manager.guard';
import { RoleManagerGuard } from '../common/guards/role-manager.guard';
import { Roles } from '../common/decorators/role-decorator';
import { RoleRequest, SearchRequest } from './dto';
import {
  CreateUserResponse,
  SearchPaginationResponse,
  RoleResponse,
} from './role.interface';
import { ACCESS_ROLE } from '../common/constant';

@Controller('manager/roles')
@UseGuards(AuthManagerGuard, RoleManagerGuard)
@UseInterceptors(ExceptionInterceptor)
export class RoleManagerController {
  constructor(private readonly roleService: RoleService) {}

  @Get()
  @Roles(ACCESS_ROLE)
  async findPagination(
    @Query() query: SearchRequest,
  ): Promise<SearchPaginationResponse> {
    const [roles, totalCount] = await this.roleService.findAndCount(query);
    return {
      data: roles,
      totalCount,
    };
  }

  @Post()
  @Roles(ACCESS_ROLE)
  async create(@Body() body: RoleRequest): Promise<CreateUserResponse> {
    const created = await this.roleService.create(body);

    return created && created.raw && created.raw[0] ? created.raw[0] : created;
  }

  @Get(':id')
  @Roles(ACCESS_ROLE)
  getUser(@Param('id') id: number): Promise<RoleResponse> {
    return this.roleService.findOne(id);
  }

  @Put(':id')
  @HttpCode(204)
  @Roles(ACCESS_ROLE)
  async update(
    @Param('id') id: number,
    @Body() body: RoleRequest,
  ): Promise<boolean> {
    const updated = await this.roleService.update(id, body);
    if (updated.affected < 1) {
      throw new InternalServerErrorException(`cannot update with id ${id}!`);
    }

    return true;
  }

  @Delete(':id')
  @Roles(ACCESS_ROLE)
  async delete(@Param('id') id: number): Promise<boolean> {
    return this.roleService.delete(id).then(() => true);
  }
}
