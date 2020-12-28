import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Repository,
  InsertResult,
  UpdateResult,
  DeleteResult,
  createQueryBuilder,
} from 'typeorm';
import { Staff } from './staff.entity';
import { StaffRequest, UpdateStaffRequest } from './dto';
import { EncryptionService } from '../common/services/encryption.service';
import { Role } from '../role/role.entity';

@Injectable()
export class StaffService {
  constructor(
    @InjectRepository(Staff)
    private readonly staffRepository: Repository<Staff>,
    private readonly encryptionService: EncryptionService,
  ) {}

  findAndCount({
    page,
    limit,
    status,
    email,
    mobile,
  }): Promise<[Staff[], number]> {
    const skip = page > 0 ? (page - 1) * limit : 0;
    let query = createQueryBuilder(Staff)
      .innerJoinAndSelect(Role, 'Role', 'Role.id = Staff.roleId')
      .select([
        'Staff.id as id',
        'email',
        'fullName',
        'mobile',
        'address',
        'Role.name as "roleName"',
        'Role.access as access',
        'status',
        'Staff.createdAt as "createdAt"',
        'Staff.updatedAt as "updatedAt"',
      ]);
    if (status) {
      query = query.andWhere(`"Staff"."userId" = :status`, { status });
    }
    if (email) {
      query = query.andWhere(`"Staff"."email" LIKE :email`, {
        email: '%' + email + '%',
      });
    }
    if (mobile) {
      query = query.andWhere(`"Staff"."mobile" LIKE :mobile`, {
        mobile: '%' + mobile + '%',
      });
    }

    return Promise.all([
      query.orderBy('Staff.id', 'DESC').skip(skip).limit(limit).getRawMany(),
      query.getCount(),
    ]);
  }

  findOne(condition, options = {}): Promise<Staff> {
    return this.staffRepository.findOne(condition, options);
  }

  findOneOrFail(options): Promise<Staff> {
    return this.staffRepository.findOneOrFail(options);
  }

  getById(id: number): Promise<Staff> {
    return createQueryBuilder(Staff)
      .innerJoinAndSelect(Role, 'Role', 'Role.id = Staff.roleId')
      .select([
        'Staff.id as id',
        'email',
        'fullName',
        'mobile',
        'address',
        'Role.id as "roleId"',
        'Role.name as "roleName"',
        'Role.access as access',
        'status',
        'Staff.createdAt as "createdAt"',
        'Staff.updatedAt as "updatedAt"',
      ])
      .where({ id })
      .getRawOne();
  }

  async create(data: StaffRequest): Promise<InsertResult> {
    const findStaff = await this.staffRepository.findOne({ email: data.email });
    if (findStaff) {
      throw new BadRequestException('Email đã tồn tại!');
    }
    const salt = this.encryptionService.getSalt();
    const password = this.encryptionService.encryptPassword(
      data.password,
      salt,
    );

    const staff = new Staff();
    staff.fullName = data.fullName;
    staff.email = data.email;
    staff.mobile = data.mobile;
    staff.password = password;
    staff.salt = salt;
    staff.address = data.address;
    staff.status = data.status;
    staff.roleId = data.roleId;

    return this.staffRepository.insert(staff);
  }

  update(id: number, data: UpdateStaffRequest): Promise<UpdateResult> {
    const staff = new Staff();
    if (data.fullName) staff.fullName = data.fullName;
    if (data.mobile) staff.mobile = data.mobile;
    if (data.address) staff.address = data.address;
    if (data.status) staff.status = data.status;
    if (data.roleId) staff.roleId = data.roleId;
    if (data.jti) staff.jti = data.jti;

    return this.staffRepository.update(id, staff);
  }

  async updatePassword(
    id: number,
    { oldPassword, newPassword },
  ): Promise<UpdateResult> {
    const currentStaff = await this.staffRepository.findOne(id);
    if (!currentStaff) {
      throw new BadRequestException('Không tìm thấy nhân viên!');
    }
    const hashOldPassword = this.encryptionService.encryptPassword(
      oldPassword,
      currentStaff.salt,
    );
    if (hashOldPassword !== currentStaff.password) {
      throw new BadRequestException('Password nhập vào không hợp lệ!');
    }

    const salt = this.encryptionService.getSalt();
    const password = this.encryptionService.encryptPassword(newPassword, salt);

    const staff = new Staff();
    staff.salt = salt;
    staff.password = password;

    return this.staffRepository.update(id, staff);
  }

  async delete(id: number): Promise<DeleteResult> {
    return this.staffRepository.delete(id);
  }
}
