import {
  Controller,
  Post,
  Get,
  Inject,
  Body,
  Param,
  Headers,
} from '@midwayjs/core';
import { CheckInService } from '../service/checkIn.service';
import { UserService } from '../service/user.service';

@Controller('/api/checkin')
export class CheckInController {
  @Inject()
  checkInService: CheckInService;

  @Inject()
  userService: UserService;

  // 生成/更新签到码 (仅活动创建者)
  @Post('/:activityId/code')
  async createCheckInCode(
    @Param('activityId') activityId: number,
    @Headers('authorization') authorization: string
  ) {
    try {
      if (!authorization) {
        return { success: false, message: '请先登录' };
      }

      const token = authorization.replace('Bearer ', '');
      const currentUser = await this.userService.validateToken(token);

      if (!currentUser) {
        return { success: false, message: '登录已过期，请重新登录' };
      }

      const result = await this.checkInService.createOrUpdateCheckInCode(
        activityId,
        currentUser.userid
      );

      return {
        success: true,
        data: result,
        message: '签到码生成成功',
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || '生成签到码失败',
      };
    }
  }

  // 用户签到
  @Post('/:activityId')
  async checkIn(
    @Param('activityId') activityId: number,
    @Body() body: { checkInCode: string },
    @Headers('authorization') authorization: string
  ) {
    try {
      if (!authorization) {
        return { success: false, message: '请先登录' };
      }

      const token = authorization.replace('Bearer ', '');
      const currentUser = await this.userService.validateToken(token);

      if (!currentUser) {
        return { success: false, message: '登录已过期，请重新登录' };
      }

      if (!body.checkInCode || !body.checkInCode.trim()) {
        return { success: false, message: '请输入签到码' };
      }

      const result = await this.checkInService.checkIn(
        currentUser.userid,
        activityId,
        body.checkInCode.trim()
      );

      return {
        success: true,
        data: result,
        message: '签到成功！',
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || '签到失败',
      };
    }
  }

  // 获取签到状态
  @Get('/:activityId/status')
  async getCheckInStatus(
    @Param('activityId') activityId: number,
    @Headers('authorization') authorization: string
  ) {
    try {
      if (!authorization) {
        return { success: false, message: '请先登录' };
      }

      const token = authorization.replace('Bearer ', '');
      const currentUser = await this.userService.validateToken(token);

      if (!currentUser) {
        return { success: false, message: '登录已过期，请重新登录' };
      }

      const result = await this.checkInService.getCheckInStatus(
        currentUser.userid,
        activityId
      );

      return {
        success: true,
        data: result,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || '获取签到状态失败',
      };
    }
  }

  // 获取活动签到列表 (仅活动创建者)
  @Get('/:activityId/list')
  async getActivityCheckIns(
    @Param('activityId') activityId: number,
    @Headers('authorization') authorization: string
  ) {
    try {
      if (!authorization) {
        return { success: false, message: '请先登录' };
      }

      const token = authorization.replace('Bearer ', '');
      const currentUser = await this.userService.validateToken(token);

      if (!currentUser) {
        return { success: false, message: '登录已过期，请重新登录' };
      }

      const result = await this.checkInService.getActivityCheckIns(
        activityId,
        currentUser.userid
      );

      return {
        success: true,
        data: result,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || '获取签到列表失败',
      };
    }
  }

  // 关闭签到 (仅活动创建者)
  @Post('/:activityId/disable')
  async disableCheckIn(
    @Param('activityId') activityId: number,
    @Headers('authorization') authorization: string
  ) {
    try {
      if (!authorization) {
        return { success: false, message: '请先登录' };
      }

      const token = authorization.replace('Bearer ', '');
      const currentUser = await this.userService.validateToken(token);

      if (!currentUser) {
        return { success: false, message: '登录已过期，请重新登录' };
      }

      const result = await this.checkInService.disableCheckIn(
        activityId,
        currentUser.userid
      );

      return {
        success: true,
        data: result,
        message: '已关闭签到',
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || '关闭签到失败',
      };
    }
  }
}
