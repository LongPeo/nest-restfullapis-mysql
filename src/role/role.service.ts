import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Repository,
  InsertResult,
  UpdateResult,
  FindManyOptions,
  Like,
  DeleteResult,
  createQueryBuilder,
} from 'typeorm';
import { Role } from './role.entity';
import { Staff } from '../staff/staff.entity';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  findAndCount({ page, limit, access }): Promise<[Role[], number]> {
    const skip = page > 0 ? (page - 1) * limit : 0;
    const where = {} as any;
    if (access) where.access = Like(`%${access}%`);
    const conditions = {
      where,
      skip,
      take: limit,
      order: {
        id: 'DESC',
      },
    } as FindManyOptions<Role>;

    return this.roleRepository.findAndCount(conditions);
  }

  findOne(condition, options = {}): Promise<Role> {
    return this.roleRepository.findOne(condition, options);
  }

  findOneOrFail(options): Promise<Role> {
    return this.roleRepository.findOneOrFail(options);
  }

  async create(data): Promise<InsertResult> {
    const role = new Role();
    role.name = data.name;
    role.access = data.access;

    return this.roleRepository.insert(role);
  }

  update(id: number, data): Promise<UpdateResult> {
    const role = new Role();
    if (data.name) role.name = data.name;
    if (data.access) role.access = data.access;

    return this.roleRepository.update(id, role);
  }

  async delete(id: number): Promise<DeleteResult> {
    const count = await createQueryBuilder(Staff)
      .where({ roleId: id })
      .getCount();
    if (count > 0) {
      throw new InternalServerErrorException(
        'Bạn không thể xóa do có nhân viên đang thuộc quyền này!',
      );
    }

    return this.roleRepository.delete(id);
  }
}
