import {
  Controller,
  Post,
  Get,
  Put,
  Body,
  Param,
  Query,
  Headers,
} from '@midwayjs/core';
import { Context } from '@midwayjs/koa';
import { Inject } from '@midwayjs/core';
import { OrderService } from '../service/order.service';
import { UserService } from '../service/user.service';
import { PaymentMethod } from '../entity';

@Controller('/api/order')
export class OrderController {
  @Inject()
  ctx: Context;

  @Inject()
  orderService: OrderService;

  @Inject()
  userService: UserService;

  /**
   * 创建订单
   */
  @Post('/create/:registrationId')
  async createOrder(@Param('registrationId') registrationId: number) {
    try {
      const order = await this.orderService.createOrder(registrationId);
      return {
        success: true,
        data: order,
        message: '订单创建成功',
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  /**
   * 获取订单详情
   */
  @Get('/:id')
  async getOrder(@Param('id') id: number) {
    try {
      const order = await this.orderService.getOrderById(id);
      return {
        success: true,
        data: order,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  /**
   * 获取我的订单列表
   */
  @Get('/my')
  async getMyOrders(
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

      const token = authHeader.substring(7); // 去掉 'Bearer ' 前缀
      const payload = await this.userService.validateToken(token);

      const result = await this.orderService.getUserOrders(
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
   * 模拟支付
   */
  @Post('/pay/:id')
  async payOrder(
    @Headers('authorization') authHeader: string,
    @Param('id') id: number,
    @Body() body: { paymentMethod?: PaymentMethod }
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

      // 验证订单归属
      const order = await this.orderService.getOrderById(id);
      if (order.userId !== payload.userid) {
        return {
          success: false,
          message: '无权限操作此订单',
        };
      }

      const paidOrder = await this.orderService.mockPay(
        id,
        body.paymentMethod || PaymentMethod.MOCK
      );

      return {
        success: true,
        data: paidOrder,
        message: '支付成功',
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  /**
   * 取消订单
   */
  @Put('/cancel/:id')
  async cancelOrder(
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

      const order = await this.orderService.cancelOrder(id, payload.userid);
      return {
        success: true,
        data: order,
        message: '订单已取消',
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  /**
   * 申请退款
   */
  @Post('/refund/:id')
  async refundOrder(
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

      const order = await this.orderService.requestRefund(id, payload.userid);
      return {
        success: true,
        data: order,
        message: '退款成功',
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }
}
