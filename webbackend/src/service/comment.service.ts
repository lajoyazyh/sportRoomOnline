import { Provide } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from '../entity';
import { Activity } from '../entity';
import { User } from '../entity';
import { Registration, RegistrationStatus } from '../entity';

@Provide()
export class CommentService {
  @InjectEntityModel(Comment)
  commentRepository: Repository<Comment>;

  @InjectEntityModel(Activity)
  activityRepository: Repository<Activity>;

  @InjectEntityModel(User)
  userRepository: Repository<User>;

  @InjectEntityModel(Registration)
  registrationRepository: Repository<Registration>;

  /**
   * 创建评论
   */
  async createComment(
    userId: number,
    activityId: number,
    content: string,
    rating: number,
    images?: string[]
  ): Promise<Comment> {
    // 验证活动是否存在
    const activity = await this.activityRepository.findOne({
      where: { id: activityId },
    });

    if (!activity) {
      throw new Error('活动不存在');
    }

    // 验证用户是否参与过该活动
    const registration = await this.registrationRepository.findOne({
      where: {
        userId,
        activityId,
        status: RegistrationStatus.APPROVED,
      },
    });

    if (!registration) {
      throw new Error('只有参与过活动的用户才能评论');
    }

    // 检查是否已经评论过
    const existingComment = await this.commentRepository.findOne({
      where: { userId, activityId },
    });

    if (existingComment) {
      throw new Error('您已经评论过此活动');
    }

    // 创建评论
    const comment = new Comment();
    comment.userId = userId;
    comment.activityId = activityId;
    comment.content = content;
    comment.rating = rating;
    comment.images = images ? JSON.stringify(images) : null;
    comment.likeCount = 0;

    const savedComment = await this.commentRepository.save(comment);

    // 更新活动的评分统计
    await this.updateActivityRating(activityId);

    return savedComment;
  }

  /**
   * 获取活动的评论列表
   */
  async getActivityComments(
    activityId: number,
    page = 1,
    limit = 10
  ): Promise<{ comments: Comment[]; total: number; averageRating: number }> {
    const [comments, total] = await this.commentRepository.findAndCount({
      where: { activityId },
      relations: ['user'],
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    // 计算平均评分
    const averageRating = await this.getActivityAverageRating(activityId);

    return { comments, total, averageRating };
  }

  /**
   * 获取用户的评论列表
   */
  async getUserComments(
    userId: number,
    page = 1,
    limit = 10
  ): Promise<{ comments: Comment[]; total: number }> {
    const [comments, total] = await this.commentRepository.findAndCount({
      where: { userId },
      relations: ['activity'],
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return { comments, total };
  }

  /**
   * 更新评论
   */
  async updateComment(
    commentId: number,
    userId: number,
    content: string,
    rating: number,
    images?: string[]
  ): Promise<Comment> {
    const comment = await this.commentRepository.findOne({
      where: { id: commentId },
    });

    if (!comment) {
      throw new Error('评论不存在');
    }

    if (comment.userId !== userId) {
      throw new Error('无权限修改此评论');
    }

    // 更新评论
    comment.content = content;
    comment.rating = rating;
    comment.images = images ? JSON.stringify(images) : null;

    const updatedComment = await this.commentRepository.save(comment);

    // 重新计算活动评分
    await this.updateActivityRating(comment.activityId);

    return updatedComment;
  }

  /**
   * 删除评论
   */
  async deleteComment(commentId: number, userId: number): Promise<void> {
    const comment = await this.commentRepository.findOne({
      where: { id: commentId },
    });

    if (!comment) {
      throw new Error('评论不存在');
    }

    if (comment.userId !== userId) {
      throw new Error('无权限删除此评论');
    }

    const activityId = comment.activityId;
    await this.commentRepository.remove(comment);

    // 重新计算活动评分
    await this.updateActivityRating(activityId);
  }

  /**
   * 点赞/取消点赞评论
   */
  async toggleLikeComment(
    commentId: number,
    increment: boolean
  ): Promise<Comment> {
    const comment = await this.commentRepository.findOne({
      where: { id: commentId },
    });

    if (!comment) {
      throw new Error('评论不存在');
    }

    // 更新点赞数
    comment.likeCount = Math.max(0, comment.likeCount + (increment ? 1 : -1));

    return await this.commentRepository.save(comment);
  }

  /**
   * 获取活动平均评分
   */
  async getActivityAverageRating(activityId: number): Promise<number> {
    const result = await this.commentRepository
      .createQueryBuilder('comment')
      .select('AVG(comment.rating)', 'average')
      .where('comment.activityId = :activityId', { activityId })
      .getRawOne();

    return result.average
      ? parseFloat(parseFloat(result.average).toFixed(1))
      : 0;
  }

  /**
   * 更新活动评分统计
   */
  private async updateActivityRating(activityId: number): Promise<void> {
    // 计算平均评分，用于触发更新（暂时不存储到Activity实体）
    await this.getActivityAverageRating(activityId);

    // 可以考虑在Activity实体中添加averageRating字段来存储
    // 这里暂时不修改Activity实体，通过查询获取评分
  }

  /**
   * 获取评论详情
   */
  async getCommentById(commentId: number): Promise<Comment> {
    const comment = await this.commentRepository.findOne({
      where: { id: commentId },
      relations: ['user', 'activity'],
    });

    if (!comment) {
      throw new Error('评论不存在');
    }

    return comment;
  }

  /**
   * 检查用户是否可以评论活动
   */
  async checkUserCanComment(
    userId: number,
    activityId: number
  ): Promise<{ canComment: boolean; message: string }> {
    // 验证活动是否存在
    const activity = await this.activityRepository.findOne({
      where: { id: activityId },
    });

    if (!activity) {
      return {
        canComment: false,
        message: '活动不存在',
      };
    }

    // 验证用户是否参与过该活动
    const registration = await this.registrationRepository.findOne({
      where: {
        userId,
        activityId,
        status: RegistrationStatus.APPROVED,
      },
    });

    if (!registration) {
      return {
        canComment: false,
        message: '只有参与过活动的用户才能评论',
      };
    }

    // 检查是否已经评论过
    const existingComment = await this.commentRepository.findOne({
      where: { userId, activityId },
    });

    if (existingComment) {
      return {
        canComment: false,
        message: '您已经评论过此活动',
      };
    }

    return {
      canComment: true,
      message: '可以评论',
    };
  }
}
