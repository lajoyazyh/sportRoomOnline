import {
  Controller,
  Post,
  Get,
  Put,
  Del,
  Body,
  Param,
  Query,
  Headers,
} from '@midwayjs/core';
import { Context } from '@midwayjs/koa';
import { Inject } from '@midwayjs/core';
import { CommentService } from '../service/comment.service';
import { UserService } from '../service/user.service';
import { CreateCommentDTO, UpdateCommentDTO } from '../dto/comment.dto';

@Controller('/api/comment')
export class CommentController {
  @Inject()
  ctx: Context;

  @Inject()
  commentService: CommentService;

  @Inject()
  userService: UserService;

  /**
   * 创建评论
   */
  @Post('/create')
  async createComment(
    @Headers('authorization') authHeader: string,
    @Body() body: CreateCommentDTO
  ) {
    try {
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return {
          success: false,
          message: '请先登录',
        };
      }

      const token = authHeader.substring(7);
      const payload = await this.userService.validateToken(token);

      const comment = await this.commentService.createComment(
        payload.userid,
        body.activityId,
        body.content,
        body.rating,
        body.images
      );

      return {
        success: true,
        data: comment,
        message: '评论发布成功',
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  /**
   * 获取活动的评论列表
   */
  @Get('/activity/:activityId')
  async getActivityComments(
    @Param('activityId') activityId: number,
    @Query('page') page = 1,
    @Query('limit') limit = 10
  ) {
    try {
      const result = await this.commentService.getActivityComments(
        activityId,
        page,
        limit
      );

      return {
        success: true,
        data: result,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  /**
   * 获取我的评论列表
   */
  @Get('/my')
  async getMyComments(
    @Headers('authorization') authHeader: string,
    @Query('page') page = 1,
    @Query('limit') limit = 10
  ) {
    try {
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return {
          success: false,
          message: '请先登录',
        };
      }

      const token = authHeader.substring(7);
      const payload = await this.userService.validateToken(token);

      const result = await this.commentService.getUserComments(
        payload.userid,
        page,
        limit
      );

      return {
        success: true,
        data: result,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  /**
   * 获取评论详情
   */
  @Get('/:id')
  async getComment(@Param('id') id: number) {
    try {
      const comment = await this.commentService.getCommentById(id);
      return {
        success: true,
        data: comment,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  /**
   * 更新评论
   */
  @Put('/:id')
  async updateComment(
    @Headers('authorization') authHeader: string,
    @Param('id') id: number,
    @Body() body: UpdateCommentDTO
  ) {
    try {
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return {
          success: false,
          message: '请先登录',
        };
      }

      const token = authHeader.substring(7);
      const payload = await this.userService.validateToken(token);

      const comment = await this.commentService.updateComment(
        id,
        payload.userid,
        body.content,
        body.rating,
        body.images
      );

      return {
        success: true,
        data: comment,
        message: '评论更新成功',
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  /**
   * 删除评论
   */
  @Del('/:id')
  async deleteComment(
    @Headers('authorization') authHeader: string,
    @Param('id') id: number
  ) {
    try {
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return {
          success: false,
          message: '请先登录',
        };
      }

      const token = authHeader.substring(7);
      const payload = await this.userService.validateToken(token);

      await this.commentService.deleteComment(id, payload.userid);

      return {
        success: true,
        message: '评论删除成功',
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  /**
   * 点赞评论
   */
  @Post('/:id/like')
  async likeComment(@Param('id') id: number) {
    try {
      const comment = await this.commentService.toggleLikeComment(id, true);
      return {
        success: true,
        data: comment,
        message: '点赞成功',
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  /**
   * 取消点赞评论
   */
  @Del('/:id/like')
  async unlikeComment(@Param('id') id: number) {
    try {
      const comment = await this.commentService.toggleLikeComment(id, false);
      return {
        success: true,
        data: comment,
        message: '取消点赞成功',
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  /**
   * 获取活动平均评分
   */
  @Get('/rating/:activityId')
  async getActivityRating(@Param('activityId') activityId: number) {
    try {
      const averageRating = await this.commentService.getActivityAverageRating(
        activityId
      );
      return {
        success: true,
        data: { averageRating },
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  /**
   * 检查用户评论权限
   */
  @Get('/permission/:activityId')
  async checkCommentPermission(
    @Param('activityId') activityId: number,
    @Headers('authorization') authHeader: string
  ) {
    try {
      if (!authHeader) {
        return {
          success: true,
          data: {
            canComment: false,
            message: '请先登录',
          },
        };
      }

      const token = authHeader.split(' ')[1];
      const user = await this.userService.getUserByToken(token);
      
      if (!user) {
        return {
          success: true,
          data: {
            canComment: false,
            message: '请先登录',
          },
        };
      }

      const permissionCheck = await this.commentService.checkUserCanComment(
        user.userid,
        activityId
      );
      
      return {
        success: true,
        data: {
          canComment: permissionCheck.canComment,
          message: permissionCheck.message,
        },
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }
}
