import { Provide } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import {
  CheckIn,
  Activity,
  Registration,
  Order,
  RegistrationStatus,
  OrderStatus,
} from '../entity';

@Provide()
export class CheckInService {
  @InjectEntityModel(CheckIn)
  checkInRepository: Repository<CheckIn>;

  @InjectEntityModel(Activity)
  activityRepository: Repository<Activity>;

  @InjectEntityModel(Registration)
  registrationRepository: Repository<Registration>;

  @InjectEntityModel(Order)
  orderRepository: Repository<Order>;

  // 生成随机签到码
  generateCheckInCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  // 创建或更新签到码 (仅活动创建者)
  async createOrUpdateCheckInCode(activityId: number, creatorId: number) {
    const activity = await this.activityRepository.findOne({
      where: { id: activityId, creatorId },
    });

    if (!activity) {
      throw new Error('活动不存在或无权限');
    }

    const checkInCode = this.generateCheckInCode();
    await this.activityRepository.update(activityId, {
      checkInCode,
      checkInEnabled: true,
    });

    return {
      checkInCode,
      checkInEnabled: true,
    };
  }

  // 验证用户是否可以签到
  async validateCheckIn(
    userId: number,
    activityId: number
  ): Promise<{
    canCheckIn: boolean;
    reason?: string;
  }> {
    // 检查是否已经签到
    const existingCheckIn = await this.checkInRepository.findOne({
      where: { userId, activityId },
    });

    if (existingCheckIn) {
      return { canCheckIn: false, reason: '您已经签到过了' };
    }

    // 检查是否已报名并支付
    const registration = await this.registrationRepository.findOne({
      where: { userId, activityId, status: RegistrationStatus.APPROVED },
    });

    if (!registration) {
      return { canCheckIn: false, reason: '您还没有报名或报名未通过审核' };
    }

    // 检查是否已支付(如果活动收费)
    const activity = await this.activityRepository.findOne({
      where: { id: activityId },
    });

    if (activity.fee > 0) {
      const order = await this.orderRepository.findOne({
        where: {
          userId,
          activityId,
          registrationId: registration.id,
          status: OrderStatus.PAID,
        },
      });

      if (!order) {
        return { canCheckIn: false, reason: '请先完成支付' };
      }
    }

    return { canCheckIn: true };
  }

  // 用户签到
  async checkIn(userId: number, activityId: number, inputCode: string) {
    // 验证是否可以签到
    const validation = await this.validateCheckIn(userId, activityId);
    if (!validation.canCheckIn) {
      throw new Error(validation.reason);
    }

    // 验证活动和签到码
    const activity = await this.activityRepository.findOne({
      where: { id: activityId },
    });

    if (!activity) {
      throw new Error('活动不存在');
    }

    if (!activity.checkInEnabled) {
      throw new Error('该活动未开启签到');
    }

    if (
      !activity.checkInCode ||
      activity.checkInCode !== inputCode.toUpperCase()
    ) {
      throw new Error('签到码错误');
    }

    // 创建签到记录
    const checkIn = this.checkInRepository.create({
      userId,
      activityId,
      checkInTime: new Date(),
      checkInCode: inputCode.toUpperCase(),
      isValid: true,
    });

    return await this.checkInRepository.save(checkIn);
  }

  // 获取用户签到状态
  async getCheckInStatus(userId: number, activityId: number) {
    const checkIn = await this.checkInRepository.findOne({
      where: { userId, activityId },
    });

    const validation = await this.validateCheckIn(userId, activityId);

    return {
      hasCheckedIn: !!checkIn,
      checkInTime: checkIn?.checkInTime || null,
      canCheckIn: validation.canCheckIn,
      reason: validation.reason,
    };
  }

  // 获取活动签到列表 (仅活动创建者)
  async getActivityCheckIns(activityId: number, creatorId: number) {
    const activity = await this.activityRepository.findOne({
      where: { id: activityId, creatorId },
    });

    if (!activity) {
      throw new Error('活动不存在或无权限');
    }

    const checkIns = await this.checkInRepository.find({
      where: { activityId },
      relations: ['user'],
      order: { checkInTime: 'DESC' },
    });

    return {
      activity: {
        id: activity.id,
        title: activity.title,
        checkInCode: activity.checkInCode,
        checkInEnabled: activity.checkInEnabled,
      },
      checkIns: checkIns.map(checkIn => ({
        id: checkIn.id,
        user: {
          userid: checkIn.user.userid,
          username: checkIn.user.username,
          nickname: checkIn.user.nickname || checkIn.user.username,
        },
        checkInTime: checkIn.checkInTime,
        checkInCode: checkIn.checkInCode,
      })),
    };
  }

  // 关闭签到 (仅活动创建者)
  async disableCheckIn(activityId: number, creatorId: number) {
    const activity = await this.activityRepository.findOne({
      where: { id: activityId, creatorId },
    });

    if (!activity) {
      throw new Error('活动不存在或无权限');
    }

    await this.activityRepository.update(activityId, {
      checkInEnabled: false,
    });

    return { success: true, message: '已关闭签到' };
  }
}
