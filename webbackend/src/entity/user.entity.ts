import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  userid: number;

  @Column({ unique: true, length: 50 })
  username: string;

  @Column({ length: 255 })
  password: string;

  @Column({ nullable: true, length: 50 })
  email: string;

  @Column({ nullable: true, length: 20 })
  phone: string;

  @Column({ nullable: true, length: 20 })
  nickname: string;

  @Column({ nullable: true, length: 50 })
  name: string;

  @Column({ nullable: true })
  age: number;

  @Column({ nullable: true, length: 10 })
  gender: string;

  @Column({ nullable: true })
  height: number;

  @Column({ nullable: true })
  weight: number;

  @Column({ nullable: true, length: 20 })
  bodyType: string; // 体型：slim, normal, muscular, plump

  @Column({ nullable: true, type: 'text' })
  avatar: string; // 头像(base64或URL)

  @Column({ nullable: true, type: 'text' })
  photos: string; // 照片墙(JSON数组字符串)

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
