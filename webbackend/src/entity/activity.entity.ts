import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

export enum ActivityType {
  FITNESS = 'fitness',
  BASKETBALL = 'basketball',
  FOOTBALL = 'football',
  BADMINTON = 'badminton',
  TENNIS = 'tennis',
  YOGA = 'yoga',
  SWIMMING = 'swimming',
  RUNNING = 'running',
  OTHER = 'other',
}

export enum ActivityStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ONGOING = 'ongoing',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

@Entity('activities')
export class Activity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'varchar', length: 20 })
  type: ActivityType;

  @Column({ type: 'varchar', length: 20, default: ActivityStatus.DRAFT })
  status: ActivityStatus;

  @Column({ length: 100 })
  location: string;

  @Column({ type: 'datetime' })
  startTime: Date;

  @Column({ type: 'datetime' })
  endTime: Date;

  @Column({ type: 'datetime' })
  registrationDeadline: Date;

  @Column({ default: 1 })
  minParticipants: number;

  @Column({ default: 50 })
  maxParticipants: number;

  @Column({ default: 0 })
  currentParticipants: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  fee: number;

  @Column({ nullable: true, type: 'text' })
  requirements: string;

  @Column({ nullable: true, type: 'text' })
  equipment: string;

  @Column({ nullable: true, type: 'text' })
  images: string;

  @Column({ nullable: true, length: 100 })
  contactInfo: string;

  @Column({ default: 0 })
  viewCount: number;

  @Column({ default: 0 })
  likeCount: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'creatorId' })
  creator: User;

  @Column()
  creatorId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
