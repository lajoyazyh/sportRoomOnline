import { Provide, Inject } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository, In } from 'typeorm';
import {
  Registration,
  RegistrationStatus,
} from '../entity/registration.entity';
import { Activity, ActivityStatus } from '../entity/activity.entity';
import { Order, OrderStatus } from '../entity/order.entity';
import {
  CreateRegistrationDTO,
  RegistrationQueryDTO,
} from '../dto/registration.dto';
import { OrderService } from './order.service';

@Provide()
export class RegistrationService {
  @InjectEntityModel(Registration)
  registrationModel: Repository<Registration>;

  @InjectEntityModel(Activity)
  activityModel: Repository<Activity>;

  @InjectEntityModel(Order)
  orderModel: Repository<Order>;

  @Inject()
  orderService: OrderService;

  // 报名活动
  async createRegistration(
    registrationData: CreateRegistrationDTO,
    userId: number
  ) {
    try {
      // 检查活动是否存在
      const activity = await this.activityModel.findOne({
        where: { id: registrationData.activityId },
      });

      if (!activity) {
        throw new Error('活动不存在');
      }

      // 检查活动状态
      if (activity.status !== ActivityStatus.PUBLISHED) {
        throw new Error('只能报名已发布的活动');
      }

      // 检查报名截止时间
      const now = new Date();
      if (activity.registrationDeadline <= now) {
        throw new Error('报名截止时间已过');
      }

      // 检查活动是否已开始
      if (activity.startTime <= now) {
        throw new Error('活动已开始，无法报名');
      }

      // 检查是否已经报名
      const existingRegistration = await this.registrationModel.findOne({
        where: {
          activityId: registrationData.activityId,
          userId,
          status: In([RegistrationStatus.PENDING, RegistrationStatus.APPROVED]),
        },
      });

      if (existingRegistration) {
        if (existingRegistration.status === RegistrationStatus.PENDING) {
          throw new Error('您已经报名了这个活动，正在等待审核');
        } else {
          throw new Error('您已经报名了这个活动');
        }
      }

      // 检查是否存在已退款的报名记录（禁止重新报名）
      const refundedRegistration = await this.registrationModel.findOne({
        where: {
          activityId: registrationData.activityId,
          userId,
          status: RegistrationStatus.CANCELLED,
        },
      });

      if (refundedRegistration) {
        // 检查该报名是否有对应的已退款订单
        const refundedOrder = await this.orderModel.findOne({
          where: {
            registrationId: refundedRegistration.id,
            status: OrderStatus.REFUNDED,
          },
        });

        if (refundedOrder) {
          throw new Error('您已申请过该活动的退款，因此无法重新报名此活动');
        }
      }

      // 检查是否为活动创建者
      if (activity.creatorId === userId) {
        throw new Error('不能报名自己创建的活动');
      }

      // 检查人数限制
      if (activity.currentParticipants >= activity.maxParticipants) {
        throw new Error('活动人数已满');
      }

      // 创建报名记录
      const registration = this.registrationModel.create({
        ...registrationData,
        userId,
        status: RegistrationStatus.PENDING, // 设置为待审核状态
      });

      const savedRegistration = await this.registrationModel.save(registration);

      // 注意：只有审核通过后才更新活动参与人数
      // 这里不再直接更新参与人数

      return savedRegistration;
    } catch (error) {
      throw new Error(`报名失败: ${error.message}`);
    }
  }

  // 取消报名
  async cancelRegistration(activityId: number, userId: number) {
    try {
      const registration = await this.registrationModel.findOne({
        where: {
          activityId,
          userId,
          status: RegistrationStatus.APPROVED,
        },
        relations: ['activity'],
      });

      if (!registration) {
        throw new Error('未找到报名记录');
      }

      // 检查活动是否已开始
      const now = new Date();
      if (registration.activity.startTime <= now) {
        throw new Error('活动已开始，无法取消报名');
      }

      // 更新报名状态
      await this.registrationModel.update(registration.id, {
        status: RegistrationStatus.CANCELLED,
      });

      // 更新活动参与人数
      await this.activityModel.update(activityId, {
        currentParticipants: registration.activity.currentParticipants - 1,
      });

      return { success: true, message: '取消报名成功' };
    } catch (error) {
      throw new Error(`取消报名失败: ${error.message}`);
    }
  }

  // 获取我的报名记录
  async getMyRegistrations(userId: number, query: RegistrationQueryDTO) {
    try {
      const { status, page = 1, pageSize = 10 } = query;

      const queryBuilder = this.registrationModel
        .createQueryBuilder('registration')
        .leftJoinAndSelect('registration.activity', 'activity')
        .leftJoinAndSelect('activity.creator', 'creator')
        .where('registration.userId = :userId', { userId })
        .select([
          'registration.id',
          'registration.activityId',
          'registration.status',
          'registration.message',
          'registration.createdAt',
          'activity.id',
          'activity.title',
          'activity.location',
          'activity.startTime',
          'activity.endTime',
          'activity.fee',
          'activity.status',
          'creator.userid',
          'creator.username',
          'creator.nickname',
        ]);

      if (status) {
        queryBuilder.andWhere('registration.status = :status', { status });
      }

      queryBuilder.orderBy('registration.createdAt', 'DESC');

      const skip = (page - 1) * pageSize;
      queryBuilder.skip(skip).take(pageSize);

      const [registrations, total] = await queryBuilder.getManyAndCount();

      return {
        list: registrations,
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      };
    } catch (error) {
      throw new Error(`获取报名记录失败: ${error.message}`);
    }
  }

  // 获取活动的报名列表（活动创建者使用）
  async getActivityRegistrations(
    activityId: number,
    creatorId: number,
    query: RegistrationQueryDTO
  ) {
    try {
      // 验证权限
      const activity = await this.activityModel.findOne({
        where: { id: activityId },
      });

      if (!activity) {
        throw new Error('活动不存在');
      }

      if (activity.creatorId !== creatorId) {
        throw new Error('只有活动创建者可以查看报名列表');
      }

      const { status, page = 1, pageSize = 10 } = query;

      const queryBuilder = this.registrationModel
        .createQueryBuilder('registration')
        .leftJoinAndSelect('registration.user', 'user')
        .where('registration.activityId = :activityId', { activityId })
        .select([
          'registration.id',
          'registration.status',
          'registration.message',
          'registration.createdAt',
          'user.userid',
          'user.username',
          'user.nickname',
          'user.avatar',
          'user.phone',
          'user.email',
        ]);

      if (status) {
        queryBuilder.andWhere('registration.status = :status', { status });
      }

      queryBuilder.orderBy('registration.createdAt', 'DESC');

      const skip = (page - 1) * pageSize;
      queryBuilder.skip(skip).take(pageSize);

      const [registrations, total] = await queryBuilder.getManyAndCount();

      return {
        list: registrations,
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      };
    } catch (error) {
      throw new Error(`获取报名列表失败: ${error.message}`);
    }
  }

  // 审核报名（通过或拒绝）
  async reviewRegistration(
    registrationId: number,
    creatorId: number,
    status: RegistrationStatus,
    rejectReason?: string
  ) {
    try {
      // 查找报名记录
      const registration = await this.registrationModel.findOne({
        where: { id: registrationId },
        relations: ['activity'],
      });

      if (!registration) {
        throw new Error('报名记录不存在');
      }

      // 验证权限
      if (registration.activity.creatorId !== creatorId) {
        throw new Error('只有活动创建者可以审核报名');
      }

      // 检查当前状态
      if (registration.status !== RegistrationStatus.PENDING) {
        throw new Error('只能审核待审核状态的报名');
      }

      // 如果是通过，检查人数限制
      if (status === RegistrationStatus.APPROVED) {
        const activity = registration.activity;
        if (activity.currentParticipants >= activity.maxParticipants) {
          throw new Error('活动人数已满，无法通过更多报名');
        }

        // 更新活动参与人数
        await this.activityModel.update(registration.activityId, {
          currentParticipants: activity.currentParticipants + 1,
        });
      }

      // 更新报名状态
      await this.registrationModel.update(registrationId, {
        status,
        rejectReason:
          status === RegistrationStatus.REJECTED ? rejectReason : null,
      });

      // 如果审核通过且活动需要付费，创建订单
      let order = null;
      if (status === RegistrationStatus.APPROVED) {
        console.log(
          `[报名审核] 开始处理报名审核通过逻辑 - 活动ID: ${registration.activityId}, 费用: ${registration.activity.fee}`
        );

        if (registration.activity.fee > 0) {
          try {
            console.log(`[报名审核] 开始为报名ID ${registrationId} 创建订单`);
            console.log('[报名审核] 报名信息:', {
              id: registration.id,
              userId: registration.userId,
              activityId: registration.activityId,
              status: registration.status,
              fee: registration.activity.fee,
            });

            order = await this.orderService.createOrder(registrationId);
            console.log('[报名审核] 订单创建成功，订单信息:', {
              id: order.id,
              orderNo: order.orderNo,
              amount: order.amount,
              status: order.status,
            });
          } catch (orderError) {
            console.error('创建订单失败 - 详细错误:', orderError);
            console.error('错误堆栈:', orderError.stack);
            // 订单创建失败不影响报名审核结果，但要记录详细错误
          }
        } else {
          console.log('[报名审核] 免费活动，无需创建订单');
        }
      }

      return {
        success: true,
        message:
          status === RegistrationStatus.APPROVED
            ? '报名审核通过'
            : '报名已拒绝',
        order, // 返回订单信息（如果有）
      };
    } catch (error) {
      throw new Error(`审核报名失败: ${error.message}`);
    }
  }

  // 检查用户是否已报名
  async checkRegistrationStatus(activityId: number, userId: number) {
    try {
      // 查找用户在该活动的最新报名记录
      const registration = await this.registrationModel.findOne({
        where: {
          activityId,
          userId,
        },
        order: {
          createdAt: 'DESC', // 按创建时间倒序，获取最新的报名记录
        },
      });

      // 检查是否有退款记录，如果有则禁止重新报名
      let hasRefunded = false;
      if (
        registration &&
        registration.status === RegistrationStatus.CANCELLED
      ) {
        const refundedOrder = await this.orderModel.findOne({
          where: {
            registrationId: registration.id,
            status: OrderStatus.REFUNDED,
          },
        });
        hasRefunded = !!refundedOrder;
      }

      return {
        isRegistered: !!registration,
        status: registration?.status || null,
        registration: registration || null,
        hasRefunded, // 添加退款状态标识
      };
    } catch (error) {
      throw new Error(`检查报名状态失败: ${error.message}`);
    }
  }
}
