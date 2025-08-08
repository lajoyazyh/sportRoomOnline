import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from './user.entity';
import { Activity } from './activity.entity';

@Entity('check_ins')
@Index(['userId', 'activityId'], { unique: true }) // 确保每个用户每个活动只能签到一次
export class CheckIn {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  activityId: number;

  @Column({ type: 'datetime' })
  checkInTime: Date;

  @Column({ type: 'varchar', length: 20 })
  checkInCode: string; // 使用的签到码

  @Column({ type: 'boolean', default: true })
  isValid: boolean;

  @Column({ type: 'text', nullable: true })
  notes: string; // 签到备注

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // 关联关系
  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Activity)
  @JoinColumn({ name: 'activityId' })
  activity: Activity;
}
