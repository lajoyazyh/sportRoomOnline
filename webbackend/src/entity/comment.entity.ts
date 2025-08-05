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

@Entity('comments')
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  activityId: number;

  @Column({ type: 'text' })
  content: string; // 评论内容

  @Column({ type: 'decimal', precision: 2, scale: 1, default: 0 })
  rating: number; // 评分(1-5星，支持小数如4.5)

  @Column({ type: 'text', nullable: true })
  images: string; // 评论图片(JSON数组格式)

  @Column({ type: 'int', default: 0 })
  likeCount: number; // 点赞数

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
}
