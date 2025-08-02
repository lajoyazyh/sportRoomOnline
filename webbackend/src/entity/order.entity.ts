import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Activity } from './activity.entity';
import { User } from './user.entity';
import { Registration } from './registration.entity';

export enum OrderStatus {
  PENDING = 'pending', // 待支付
  PAID = 'paid', // 已支付
  REFUNDED = 'refunded', // 已退款
  CANCELLED = 'cancelled', // 已取消
  EXPIRED = 'expired', // 已过期
}

export enum PaymentMethod {
  WECHAT = 'wechat', // 微信支付
  ALIPAY = 'alipay', // 支付宝
  MOCK = 'mock', // 模拟支付
}

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 32 })
  orderNo: string; // 订单号，格式：yyyyMMddHHmmss + 6位随机数

  @Column()
  userId: number;

  @Column()
  activityId: number;

  @Column()
  registrationId: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number; // 订单金额

  @Column({ type: 'varchar', length: 20, default: OrderStatus.PENDING })
  status: OrderStatus;

  @Column({ type: 'varchar', length: 20, nullable: true })
  paymentMethod: PaymentMethod;

  @Column({ type: 'datetime', nullable: true })
  paymentTime: Date; // 支付时间

  @Column({ length: 100, nullable: true })
  thirdPartyOrderId: string; // 第三方订单ID

  @Column({ type: 'datetime', nullable: true })
  refundTime: Date; // 退款时间

  @Column({ type: 'datetime' })
  expireTime: Date; // 订单过期时间（创建后30分钟）

  @Column({ type: 'text', nullable: true })
  remark: string; // 备注

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // 关联用户
  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  // 关联活动
  @ManyToOne(() => Activity)
  @JoinColumn({ name: 'activityId' })
  activity: Activity;

  // 关联报名记录
  @ManyToOne(() => Registration)
  @JoinColumn({ name: 'registrationId' })
  registration: Registration;
}
