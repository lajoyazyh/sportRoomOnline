import {
  Controller,
  Post,
  Get,
  Del,
  Body,
  Param,
  Query,
  Headers,
  Inject,
} from '@midwayjs/core';
import { Validate } from '@midwayjs/validate';
import { RegistrationService } from '../service/registration.service';
import { UserService } from '../service/user.service';
import {
  CreateRegistrationDTO,
  RegistrationQueryDTO,
  ReviewRegistrationDTO,
} from '../dto/registration.dto';

@Controller('/api/registration')
export class RegistrationController {
  @Inject()
  registrationService: RegistrationService;

  @Inject()
  userService: UserService;

  @Post('/apply')
  @Validate()
  async applyForActivity(
    @Body() registrationData: CreateRegistrationDTO,
    @Headers('authorization') authHeader: string
  ) {
    try {
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return {
          success: false,
          message: '缺少认证令牌',
        };
      }

      const token = authHeader.substring(7);
      const payload = await this.userService.validateToken(token);

      const registration = await this.registrationService.createRegistration(
        registrationData,
        payload.userid
      );

      return {
        success: true,
        message: '报名成功',
        data: registration,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || '报名失败',
      };
    }
  }

  @Del('/cancel/:activityId')
  async cancelRegistration(
    @Param('activityId') activityId: string,
    @Headers('authorization') authHeader: string
  ) {
    try {
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return {
          success: false,
          message: '缺少认证令牌',
        };
      }

      const token = authHeader.substring(7);
      const payload = await this.userService.validateToken(token);
      const activityIdNum = parseInt(activityId);

      if (isNaN(activityIdNum)) {
        return {
          success: false,
          message: '无效的活动ID',
        };
      }

      const result = await this.registrationService.cancelRegistration(
        activityIdNum,
        payload.userid
      );

      return result;
    } catch (error) {
      return {
        success: false,
        message: error.message || '取消报名失败',
      };
    }
  }

  @Get('/my')
  @Validate()
  async getMyRegistrations(
    @Query() query: RegistrationQueryDTO,
    @Headers('authorization') authHeader: string
  ) {
    try {
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return {
          success: false,
          message: '缺少认证令牌',
        };
      }

      const token = authHeader.substring(7);
      const payload = await this.userService.validateToken(token);

      const result = await this.registrationService.getMyRegistrations(
        payload.userid,
        query
      );

      return {
        success: true,
        message: '获取报名记录成功',
        data: result,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || '获取报名记录失败',
      };
    }
  }

  @Get('/activity/:activityId')
  @Validate()
  async getActivityRegistrations(
    @Param('activityId') activityId: string,
    @Query() query: RegistrationQueryDTO,
    @Headers('authorization') authHeader: string
  ) {
    try {
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return {
          success: false,
          message: '缺少认证令牌',
        };
      }

      const token = authHeader.substring(7);
      const payload = await this.userService.validateToken(token);
      const activityIdNum = parseInt(activityId);

      if (isNaN(activityIdNum)) {
        return {
          success: false,
          message: '无效的活动ID',
        };
      }

      const result = await this.registrationService.getActivityRegistrations(
        activityIdNum,
        payload.userid,
        query
      );

      return {
        success: true,
        message: '获取报名列表成功',
        data: result,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || '获取报名列表失败',
      };
    }
  }

  @Get('/status/:activityId')
  async checkRegistrationStatus(
    @Param('activityId') activityId: string,
    @Headers('authorization') authHeader: string
  ) {
    try {
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return {
          success: false,
          message: '缺少认证令牌',
        };
      }

      const token = authHeader.substring(7);
      const payload = await this.userService.validateToken(token);
      const activityIdNum = parseInt(activityId);

      if (isNaN(activityIdNum)) {
        return {
          success: false,
          message: '无效的活动ID',
        };
      }

      const result = await this.registrationService.checkRegistrationStatus(
        activityIdNum,
        payload.userid
      );

      return {
        success: true,
        message: '获取报名状态成功',
        data: result,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || '获取报名状态失败',
      };
    }
  }

  @Post('/review/:registrationId')
  @Validate()
  async reviewRegistration(
    @Param('registrationId') registrationId: string,
    @Body() reviewData: ReviewRegistrationDTO,
    @Headers('authorization') authHeader: string
  ) {
    try {
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return {
          success: false,
          message: '缺少认证令牌',
        };
      }

      const token = authHeader.substring(7);
      const payload = await this.userService.validateToken(token);
      const regIdNum = parseInt(registrationId);

      if (isNaN(regIdNum)) {
        return {
          success: false,
          message: '无效的报名ID',
        };
      }

      const result = await this.registrationService.reviewRegistration(
        regIdNum,
        payload.userid,
        reviewData.status,
        reviewData.rejectReason
      );

      return result;
    } catch (error) {
      return {
        success: false,
        message: error.message || '审核失败',
      };
    }
  }
}
