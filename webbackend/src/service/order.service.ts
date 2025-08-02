import { Provide } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { Order, OrderStatus, PaymentMethod } from '../entity';
import { Registration, RegistrationStatus } from '../entity';
import { Activity } from '../entity';

@Provide()
export class OrderService {
  @InjectEntityModel(Order)
  orderRepository: Repository<Order>;

  @InjectEntityModel(Registration)
  registrationRepository: Repository<Registration>;

  @InjectEntityModel(Activity)
  activityRepository: Repository<Activity>;

  /**
   * 生成订单号
   */
  generateOrderNo(): string {
    const now = new Date();
    const timestamp = now
      .toISOString()
      .replace(/[-:T.]/g, '')
      .substring(0, 14);
    const random = Math.floor(Math.random() * 1000000)
      .toString()
      .padStart(6, '0');
    return `${timestamp}${random}`;
  }

  /**
   * 创建订单
   */
  async createOrder(registrationId: number): Promise<Order> {
    console.log(`[订单服务] 开始创建订单，报名ID: ${registrationId}`);

    // 获取报名信息
    const registration = await this.registrationRepository.findOne({
      where: { id: registrationId },
      relations: ['activity', 'user'],
    });

    console.log(
      '[订单服务] 查询到的报名信息:',
      registration
        ? {
            id: registration.id,
            userId: registration.userId,
            activityId: registration.activityId,
            status: registration.status,
            activityFee: registration.activity?.fee,
          }
        : null
    );

    if (!registration) {
      throw new Error('报名记录不存在');
    }

    if (registration.status !== RegistrationStatus.APPROVED) {
      throw new Error(
        `只有审核通过的报名才能创建订单，当前状态: ${registration.status}`
      );
    }

    // 检查活动费用
    if (registration.activity.fee <= 0) {
      throw new Error('免费活动无需创建订单');
    }

    // 检查是否已存在订单
    const existingOrder = await this.orderRepository.findOne({
      where: { registrationId },
    });

    console.log(
      '[订单服务] 已存在订单:',
      existingOrder
        ? {
            id: existingOrder.id,
            status: existingOrder.status,
            expireTime: existingOrder.expireTime,
          }
        : null
    );

    if (existingOrder) {
      if (existingOrder.status === OrderStatus.PAID) {
        throw new Error('该报名已完成支付');
      }
      if (
        existingOrder.status === OrderStatus.PENDING &&
        existingOrder.expireTime > new Date()
      ) {
        console.log('[订单服务] 返回未过期的待支付订单');
        return existingOrder; // 返回未过期的待支付订单
      }
    }

    // 创建新订单
    const order = new Order();
    order.orderNo = this.generateOrderNo();
    order.userId = registration.userId;
    order.activityId = registration.activityId;
    order.registrationId = registrationId;
    order.amount = registration.activity.fee;
    order.status = OrderStatus.PENDING;
    order.expireTime = new Date(Date.now() + 30 * 60 * 1000); // 30分钟后过期

    console.log('[订单服务] 准备保存订单:', {
      orderNo: order.orderNo,
      userId: order.userId,
      activityId: order.activityId,
      registrationId: order.registrationId,
      amount: order.amount,
      status: order.status,
    });

    const savedOrder = await this.orderRepository.save(order);
    console.log('[订单服务] 订单保存成功，ID:', savedOrder.id);

    return savedOrder;
  }

  /**
   * 获取订单详情
   */
  async getOrderById(id: number): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['user', 'activity', 'registration'],
    });

    if (!order) {
      throw new Error('订单不存在');
    }

    return order;
  }

  /**
   * 获取用户订单列表
   */
  async getUserOrders(
    userId: number,
    page = 1,
    limit = 10
  ): Promise<{ orders: Order[]; total: number }> {
    const [orders, total] = await this.orderRepository.findAndCount({
      where: { userId },
      relations: ['activity', 'registration'],
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return { orders, total };
  }

  /**
   * 模拟支付
   */
  async mockPay(
    orderId: number,
    paymentMethod: PaymentMethod = PaymentMethod.MOCK
  ): Promise<Order> {
    const order = await this.getOrderById(orderId);

    if (order.status !== OrderStatus.PENDING) {
      throw new Error('订单状态不正确，无法支付');
    }

    if (order.expireTime < new Date()) {
      // 订单已过期，更新状态
      order.status = OrderStatus.EXPIRED;
      await this.orderRepository.save(order);
      throw new Error('订单已过期');
    }

    // 模拟支付成功
    order.status = OrderStatus.PAID;
    order.paymentMethod = paymentMethod;
    order.paymentTime = new Date();
    order.thirdPartyOrderId = `mock_${Date.now()}`; // 模拟第三方订单号

    // 支付完成后，报名状态保持为 APPROVED，不需要改为 COMPLETED
    // 报名状态的生命周期: pending -> approved (通过审核后保持此状态)

    return await this.orderRepository.save(order);
  }

  /**
   * 取消订单
   */
  async cancelOrder(orderId: number, userId: number): Promise<Order> {
    const order = await this.getOrderById(orderId);

    if (order.userId !== userId) {
      throw new Error('无权限操作此订单');
    }

    if (order.status !== OrderStatus.PENDING) {
      throw new Error('只能取消待支付的订单');
    }

    order.status = OrderStatus.CANCELLED;
    return await this.orderRepository.save(order);
  }

  /**
   * 申请退款（模拟）
   */
  async requestRefund(orderId: number, userId: number): Promise<Order> {
    const order = await this.getOrderById(orderId);

    if (order.userId !== userId) {
      throw new Error('无权限操作此订单');
    }

    if (order.status !== OrderStatus.PAID) {
      throw new Error('只能对已支付的订单申请退款');
    }

    // 检查活动时间，活动开始前2小时可以退款
    const activity = order.activity;
    const refundDeadline = new Date(
      activity.startTime.getTime() - 2 * 60 * 60 * 1000
    );

    if (new Date() > refundDeadline) {
      throw new Error('活动开始前2小时内不允许退款');
    }

    // 模拟退款成功
    order.status = OrderStatus.REFUNDED;
    order.refundTime = new Date();

    // 更新报名状态为已取消
    await this.registrationRepository.update(
      { id: order.registrationId },
      { status: RegistrationStatus.CANCELLED }
    );

    // 减少活动参与人数
    await this.activityRepository.decrement(
      { id: order.activityId },
      'currentParticipants',
      1
    );

    return await this.orderRepository.save(order);
  }

  /**
   * 清理过期订单（定时任务可调用）
   */
  async cleanExpiredOrders(): Promise<number> {
    const expiredOrders = await this.orderRepository.find({
      where: {
        status: OrderStatus.PENDING,
        expireTime: {
          $lt: new Date(),
        } as any,
      },
    });

    for (const order of expiredOrders) {
      order.status = OrderStatus.EXPIRED;
      await this.orderRepository.save(order);
    }

    return expiredOrders.length;
  }
}
