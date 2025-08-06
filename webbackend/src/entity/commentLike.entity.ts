import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from './user.entity';
import { Comment } from './comment.entity';

@Entity('comment_likes')
@Index(['userId', 'commentId'], { unique: true }) // 确保每个用户对每条评论只能点一次赞
export class CommentLike {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  commentId: number;

  @CreateDateColumn()
  createdAt: Date;

  // 关联关系
  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Comment, comment => comment.likes)
  @JoinColumn({ name: 'commentId' })
  comment: Comment;
}
