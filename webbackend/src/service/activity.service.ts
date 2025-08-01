import { Provide } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { Activity, ActivityStatus } from '../entity/activity.entity';
import {
  CreateActivityDTO,
  UpdateActivityDTO,
  ActivityQueryDTO,
} from '../dto/activity.dto';

@Provide()
export class ActivityService {
  @InjectEntityModel(Activity)
  activityModel: Repository<Activity>;

  // 创建活动
  async createActivity(activityData: CreateActivityDTO, creatorId: number) {
    try {
      // 验证时间逻辑
      const now = new Date();
      const startTime = new Date(activityData.startTime);
      const endTime = new Date(activityData.endTime);
      const registrationDeadline = new Date(activityData.registrationDeadline);

      if (startTime <= now) {
        throw new Error('活动开始时间必须晚于当前时间');
      }

      if (endTime <= startTime) {
        throw new Error('活动结束时间必须晚于开始时间');
      }

      if (registrationDeadline >= startTime) {
        throw new Error('报名截止时间必须早于活动开始时间');
      }

      if (activityData.minParticipants > activityData.maxParticipants) {
        throw new Error('最少参与人数不能大于最多参与人数');
      }

      const activity = this.activityModel.create({
        ...activityData,
        creatorId,
        status: activityData.status || ActivityStatus.PUBLISHED,
        currentParticipants: 0,
        viewCount: 0,
        likeCount: 0,
      });

      return await this.activityModel.save(activity);
    } catch (error) {
      throw new Error(`创建活动失败: ${error.message}`);
    }
  }

  // 获取活动列表
  async getActivityList(query: ActivityQueryDTO) {
    try {
      const {
        search,
        type,
        status,
        page = 1,
        pageSize = 10,
        sortBy = 'createdAt',
        sortOrder = 'DESC',
      } = query;

      const queryBuilder = this.activityModel
        .createQueryBuilder('activity')
        .leftJoinAndSelect('activity.creator', 'creator')
        .select([
          'activity.id',
          'activity.title',
          'activity.description',
          'activity.type',
          'activity.status',
          'activity.location',
          'activity.startTime',
          'activity.endTime',
          'activity.registrationDeadline',
          'activity.minParticipants',
          'activity.maxParticipants',
          'activity.currentParticipants',
          'activity.fee',
          'activity.images',
          'activity.viewCount',
          'activity.likeCount',
          'activity.createdAt',
          'creator.userid',
          'creator.username',
          'creator.nickname',
          'creator.avatar',
        ]);

      // 搜索条件
      if (search) {
        queryBuilder.andWhere(
          '(activity.title LIKE :search OR activity.description LIKE :search OR activity.location LIKE :search)',
          { search: `%${search}%` }
        );
      }

      // 类型筛选
      if (type) {
        queryBuilder.andWhere('activity.type = :type', { type });
      }

      // 状态筛选逻辑
      if (status !== undefined && status !== '') {
        // 传递了具体的状态值，按该状态筛选
        queryBuilder.andWhere('activity.status = :status', { status });
      }
      // 如果没有传status参数或status为空字符串，则显示所有状态的活动（不添加筛选条件）

      // 排序
      const sortField =
        sortBy === 'createdAt' ? 'activity.createdAt' : `activity.${sortBy}`;
      queryBuilder.orderBy(sortField, sortOrder);

      // 分页
      const skip = (page - 1) * pageSize;
      queryBuilder.skip(skip).take(pageSize);

      const [activities, total] = await queryBuilder.getManyAndCount();

      return {
        list: activities,
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      };
    } catch (error) {
      throw new Error(`获取活动列表失败: ${error.message}`);
    }
  }

  // 获取活动详情
  async getActivityDetail(id: number) {
    try {
      const activity = await this.activityModel
        .createQueryBuilder('activity')
        .leftJoinAndSelect('activity.creator', 'creator')
        .select([
          'activity',
          'creator.userid',
          'creator.username',
          'creator.nickname',
          'creator.avatar',
          'creator.phone',
          'creator.email',
        ])
        .where('activity.id = :id', { id })
        .getOne();

      if (!activity) {
        throw new Error('活动不存在');
      }

      // 增加浏览次数
      await this.activityModel.update(id, {
        viewCount: activity.viewCount + 1,
      });

      return {
        ...activity,
        viewCount: activity.viewCount + 1,
      };
    } catch (error) {
      throw new Error(`获取活动详情失败: ${error.message}`);
    }
  }

  // 更新活动
  async updateActivity(
    id: number,
    updateData: UpdateActivityDTO,
    userId: number
  ) {
    try {
      const activity = await this.activityModel.findOne({
        where: { id },
        relations: ['creator'],
      });

      if (!activity) {
        throw new Error('活动不存在');
      }

      // 检查权限
      if (activity.creatorId !== userId) {
        throw new Error('只有活动创建者可以编辑活动');
      }

      // 检查活动状态
      if (
        activity.status === ActivityStatus.COMPLETED ||
        activity.status === ActivityStatus.CANCELLED
      ) {
        throw new Error('已完成或已取消的活动不能编辑');
      }

      // 验证时间逻辑（如果有时间更新）
      if (
        updateData.startTime ||
        updateData.endTime ||
        updateData.registrationDeadline
      ) {
        const startTime = new Date(updateData.startTime || activity.startTime);
        const endTime = new Date(updateData.endTime || activity.endTime);
        const registrationDeadline = new Date(
          updateData.registrationDeadline || activity.registrationDeadline
        );

        if (endTime <= startTime) {
          throw new Error('活动结束时间必须晚于开始时间');
        }

        if (registrationDeadline >= startTime) {
          throw new Error('报名截止时间必须早于活动开始时间');
        }
      }

      await this.activityModel.update(id, updateData);

      return await this.getActivityDetail(id);
    } catch (error) {
      throw new Error(`更新活动失败: ${error.message}`);
    }
  }

  // 删除活动
  async deleteActivity(id: number, userId: number) {
    try {
      const activity = await this.activityModel.findOne({
        where: { id },
      });

      if (!activity) {
        throw new Error('活动不存在');
      }

      // 检查权限
      if (activity.creatorId !== userId) {
        throw new Error('只有活动创建者可以删除活动');
      }

      // 检查是否有人报名
      if (activity.currentParticipants > 0) {
        throw new Error('已有人报名的活动不能删除，只能取消');
      }

      await this.activityModel.delete(id);

      return { success: true, message: '活动删除成功' };
    } catch (error) {
      throw new Error(`删除活动失败: ${error.message}`);
    }
  }

  // 获取我创建的活动
  async getMyActivities(userId: number, query: ActivityQueryDTO) {
    try {
      const {
        status,
        page = 1,
        pageSize = 10,
        sortBy = 'createdAt',
        sortOrder = 'DESC',
      } = query;

      const queryBuilder = this.activityModel
        .createQueryBuilder('activity')
        .where('activity.creatorId = :userId', { userId });

      if (status) {
        queryBuilder.andWhere('activity.status = :status', { status });
      }

      const sortField =
        sortBy === 'createdAt' ? 'activity.createdAt' : `activity.${sortBy}`;
      queryBuilder.orderBy(sortField, sortOrder);

      const skip = (page - 1) * pageSize;
      queryBuilder.skip(skip).take(pageSize);

      const [activities, total] = await queryBuilder.getManyAndCount();

      return {
        list: activities,
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      };
    } catch (error) {
      throw new Error(`获取我的活动失败: ${error.message}`);
    }
  }

  // 上传活动图片
  async uploadActivityImages(activityId: number, files: any[], userId: number) {
    try {
      const activity = await this.activityModel.findOne({
        where: { id: activityId },
      });

      if (!activity) {
        throw new Error('活动不存在');
      }

      if (activity.creatorId !== userId) {
        throw new Error('只有活动创建者可以上传图片');
      }

      const imageBase64s: string[] = [];

      for (const file of files) {
        // 检查文件大小（5MB限制）
        if (file.size > 5 * 1024 * 1024) {
          throw new Error('图片大小不能超过5MB');
        }

        // 检查文件类型
        const allowedTypes = [
          'image/jpeg',
          'image/jpg',
          'image/png',
          'image/gif',
        ];
        if (!allowedTypes.includes(file.mimeType)) {
          throw new Error('只支持 JPG、PNG、GIF 格式的图片');
        }

        // 读取文件并转换为base64
        const fs = require('fs');
        const buffer = fs.readFileSync(file.data);
        const base64 = `data:${file.mimeType};base64,${buffer.toString(
          'base64'
        )}`;
        imageBase64s.push(base64);
      }

      // 获取现有图片
      let existingImages: string[] = [];
      if (activity.images) {
        try {
          existingImages = JSON.parse(activity.images);
        } catch (e) {
          existingImages = [];
        }
      }

      // 合并图片（最多保留10张）
      const allImages = [...existingImages, ...imageBase64s].slice(0, 10);

      await this.activityModel.update(activityId, {
        images: JSON.stringify(allImages),
      });

      return {
        success: true,
        message: `成功上传${imageBase64s.length}张图片`,
        totalImages: allImages.length,
      };
    } catch (error) {
      throw new Error(`上传活动图片失败: ${error.message}`);
    }
  }
}
