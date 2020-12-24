import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Index,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ACCOUNT_INACTIVE, ACCOUNT_ACTIVE } from '../common/constant';

@Entity()
export class Staff {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Index({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  fullName: string;

  @Column()
  salt: string;

  @Column()
  mobile: string;

  @Column()
  address: string;

  @Column({ default: null })
  jti: string;

  @Column({
    type: 'enum',
    enum: [ACCOUNT_INACTIVE, ACCOUNT_ACTIVE],
    default: ACCOUNT_ACTIVE,
  })
  status: string;

  @Column()
  roleId: number;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
