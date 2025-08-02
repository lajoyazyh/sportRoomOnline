import {
  Controller,
  Post,
  Get,
  Put,
  Body,
  Param,
  Query,
  Headers,
  Files,
  Del,
} from '@midwayjs/core';
import { Validate } from '@midwayjs/validate';
import { Inject } from '@midwayjs/core';
import { ActivityService } from '../service/activity.service';
import { UserService } from '../service/user.service';
import {
  CreateActivityDTO,
  UpdateActivityDTO,
  ActivityQueryDTO,
} from '../dto/activity.dto';

@Controller('/api/activity')
export class ActivityController {
  @Inject()
  activityService: ActivityService;

  @Inject()
  userService: UserService;

  @Post('/create')
  async createActivity(
    @Body() activityData: CreateActivityDTO,
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
      console.log('🔍 [createActivity] 创建者ID:', payload.userid);

      // 如果是草稿状态，跳过DTO验证
      const isDraft = activityData.status === 'draft';

      const activity = await this.activityService.createActivity(
        activityData,
        payload.userid,
        isDraft
      );

      console.log(
        '🔍 [createActivity] 已创建活动ID:',
        activity.id,
        '创建者ID:',
        activity.creatorId,
        '状态:',
        activity.status
      );
      return {
        success: true,
        message: isDraft ? '草稿保存成功' : '活动创建成功',
        data: activity,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || '创建活动失败',
      };
    }
  }

  @Get('/list')
  @Validate()
  async getActivityList(@Query() query: ActivityQueryDTO) {
    try {
      const result = await this.activityService.getActivityList(query);

      return {
        success: true,
        message: '获取活动列表成功',
        data: result,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || '获取活动列表失败',
      };
    }
  }

  @Get('/:id')
  async getActivityDetail(@Param('id') id: string) {
    try {
      const activityId = parseInt(id);
      if (isNaN(activityId)) {
        return {
          success: false,
          message: '无效的活动ID',
        };
      }

      const activity = await this.activityService.getActivityDetail(activityId);

      return {
        success: true,
        message: '获取活动详情成功',
        data: activity,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || '获取活动详情失败',
      };
    }
  }

  @Put('/:id')
  @Validate()
  async updateActivity(
    @Param('id') id: string,
    @Body() updateData: UpdateActivityDTO,
    @Headers('authorization') authHeader: string
  ) {
    try {
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return {
          success: false,
          message: '缺少认证令牌',
        };
      }

      const activityId = parseInt(id);
      if (isNaN(activityId)) {
        return {
          success: false,
          message: '无效的活动ID',
        };
      }

      const token = authHeader.substring(7);
      const payload = await this.userService.validateToken(token);

      const activity = await this.activityService.updateActivity(
        activityId,
        updateData,
        payload.userid
      );

      return {
        success: true,
        message: '活动更新成功',
        data: activity,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || '更新活动失败',
      };
    }
  }

  @Del('/:id')
  async deleteActivity(
    @Param('id') id: string,
    @Headers('authorization') authHeader: string
  ) {
    try {
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return {
          success: false,
          message: '缺少认证令牌',
        };
      }

      const activityId = parseInt(id);
      if (isNaN(activityId)) {
        return {
          success: false,
          message: '无效的活动ID',
        };
      }

      const token = authHeader.substring(7);
      const payload = await this.userService.validateToken(token);

      const result = await this.activityService.deleteActivity(
        activityId,
        payload.userid
      );

      return {
        success: true,
        message: result.message,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || '删除活动失败',
      };
    }
  }

  @Get('/my/activities')
  @Validate()
  async getMyActivities(
    @Query() query: ActivityQueryDTO,
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
      console.log('🔍 [getMyActivities] 用户ID:', payload.userid);

      const result = await this.activityService.getMyActivities(
        payload.userid,
        query
      );

      console.log(
        '🔍 [getMyActivities] 查询结果:',
        result.list.length,
        '个活动'
      );

      return {
        success: true,
        message: '获取我的活动成功',
        data: result,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || '获取我的活动失败',
      };
    }
  }

  @Post('/:id/upload-images')
  async uploadActivityImages(
    @Param('id') id: string,
    @Headers('authorization') authHeader: string,
    @Files() files
  ) {
    try {
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return {
          success: false,
          message: '缺少认证令牌',
        };
      }

      const activityId = parseInt(id);
      if (isNaN(activityId)) {
        return {
          success: false,
          message: '无效的活动ID',
        };
      }

      const token = authHeader.substring(7);
      const payload = await this.userService.validateToken(token);

      if (!files || files.length === 0) {
        return {
          success: false,
          message: '没有上传的文件',
        };
      }

      const result = await this.activityService.uploadActivityImages(
        activityId,
        files,
        payload.userid
      );

      return {
        success: true,
        message: result.message,
        data: {
          totalImages: result.totalImages,
        },
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || '上传活动图片失败',
      };
    }
  }

  @Get('/search')
  @Validate()
  async searchActivities(@Query() query: ActivityQueryDTO) {
    try {
      // 搜索接口与列表接口逻辑相同，但可以添加更复杂的搜索逻辑
      const result = await this.activityService.getActivityList(query);

      return {
        success: true,
        message: '搜索活动成功',
        data: result,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || '搜索活动失败',
      };
    }
  }
}
