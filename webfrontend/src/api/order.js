const API_BASE_URL = 'http://localhost:7001';

// 获取Token
const getToken = () => {
  return localStorage.getItem('token');
};

// 通用请求函数
const request = async (url, options = {}) => {
  const token = getToken();
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${url}`, config);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

// 订单API
export const orderAPI = {
  // 创建订单
  createOrder: async (registrationId) => {
    return request(`/api/order/create/${registrationId}`, {
      method: 'POST',
    });
  },

  // 获取订单详情
  getOrder: async (orderId) => {
    return request(`/api/order/${orderId}`);
  },

  // 获取我的订单列表
  getMyOrders: async (page = 1, limit = 10) => {
    return request(`/api/order/my?page=${page}&limit=${limit}`);
  },

  // 支付订单（模拟支付）
  payOrder: async (orderId, paymentMethod = 'mock') => {
    return request(`/api/order/pay/${orderId}`, {
      method: 'POST',
      body: JSON.stringify({ paymentMethod }),
    });
  },

  // 取消订单
  cancelOrder: async (orderId) => {
    return request(`/api/order/cancel/${orderId}`, {
      method: 'PUT',
    });
  },

  // 申请退款
  refundOrder: async (orderId) => {
    return request(`/api/order/refund/${orderId}`, {
      method: 'POST',
    });
  },
};

// 订单状态映射
export const ORDER_STATUS = {
  PENDING: 'pending',
  PAID: 'paid',
  REFUNDED: 'refunded',
  CANCELLED: 'cancelled',
  EXPIRED: 'expired',
};

// 订单状态显示文本
export const ORDER_STATUS_TEXT = {
  [ORDER_STATUS.PENDING]: '待支付',
  [ORDER_STATUS.PAID]: '已支付',
  [ORDER_STATUS.REFUNDED]: '已退款',
  [ORDER_STATUS.CANCELLED]: '已取消',
  [ORDER_STATUS.EXPIRED]: '已过期',
};

// 支付方式
export const PAYMENT_METHOD = {
  WECHAT: 'wechat',
  ALIPAY: 'alipay',
  MOCK: 'mock',
};

// 支付方式显示文本
export const PAYMENT_METHOD_TEXT = {
  [PAYMENT_METHOD.WECHAT]: '微信支付',
  [PAYMENT_METHOD.ALIPAY]: '支付宝',
  [PAYMENT_METHOD.MOCK]: '模拟支付',
};
