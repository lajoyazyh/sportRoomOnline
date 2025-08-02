import React, { useState, useEffect } from 'react';
import { orderAPI, ORDER_STATUS_TEXT, PAYMENT_METHOD_TEXT } from '../../api/order';

const OrderListPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState('');

  // 加载订单列表
  const loadOrders = async (page = 1) => {
    try {
      setLoading(true);
      const response = await orderAPI.getMyOrders(page, 10);
      
      if (response.success) {
        setOrders(response.data.orders);
        setTotalPages(Math.ceil(response.data.total / 10));
        setCurrentPage(page);
      } else {
        setError(response.message || '获取订单列表失败');
      }
    } catch (error) {
      console.error('加载订单失败:', error);
      setError('网络错误，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  // 支付订单
  const handlePay = async (orderId) => {
    try {
      const response = await orderAPI.payOrder(orderId, 'mock');
      
      if (response.success) {
        alert('支付成功！');
        loadOrders(currentPage); // 刷新列表
      } else {
        alert(response.message || '支付失败');
      }
    } catch (error) {
      console.error('支付失败:', error);
      alert('支付失败，请稍后重试');
    }
  };

  // 取消订单
  const handleCancel = async (orderId) => {
    if (!confirm('确定要取消这个订单吗？')) {
      return;
    }

    try {
      const response = await orderAPI.cancelOrder(orderId);
      
      if (response.success) {
        alert('订单已取消');
        loadOrders(currentPage); // 刷新列表
      } else {
        alert(response.message || '取消订单失败');
      }
    } catch (error) {
      console.error('取消订单失败:', error);
      alert('取消订单失败，请稍后重试');
    }
  };

  // 申请退款
  const handleRefund = async (orderId) => {
    if (!confirm('确定要申请退款吗？退款后将取消活动参与资格。')) {
      return;
    }

    try {
      const response = await orderAPI.refundOrder(orderId);
      
      if (response.success) {
        alert('退款成功！');
        loadOrders(currentPage); // 刷新列表
      } else {
        alert(response.message || '退款失败');
      }
    } catch (error) {
      console.error('退款失败:', error);
      alert('退款失败，请稍后重试');
    }
  };

  // 格式化时间
  const formatTime = (timeString) => {
    if (!timeString) return '-';
    const date = new Date(timeString);
    return date.toLocaleString('zh-CN');
  };

  // 判断订单是否即将过期（剩余时间少于10分钟）
  const isOrderExpiringSoon = (expireTime) => {
    if (!expireTime) return false;
    const remaining = new Date(expireTime) - new Date();
    return remaining > 0 && remaining < 10 * 60 * 1000; // 10分钟
  };

  // 获取剩余时间
  const getRemainingTime = (expireTime) => {
    if (!expireTime) return '';
    const remaining = new Date(expireTime) - new Date();
    if (remaining <= 0) return '已过期';
    
    const minutes = Math.floor(remaining / (1000 * 60));
    const seconds = Math.floor((remaining % (1000 * 60)) / 1000);
    return `${minutes}分${seconds}秒`;
  };

  useEffect(() => {
    loadOrders();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <div className="text-gray-600">加载中...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* 页面标题 */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">我的订单</h1>
          <p className="text-gray-600 mt-1">管理您的活动订单和支付状态</p>
        </div>

        {/* 错误提示 */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* 订单列表 */}
        {orders.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg">暂无订单</div>
            <p className="text-gray-400 mt-2">参与付费活动后会在这里显示订单信息</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {order.activity?.title || '活动标题'}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      订单号: {order.orderNo}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">
                      ¥{order.amount}
                    </div>
                    <div className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      order.status === 'paid' ? 'bg-green-100 text-green-800' :
                      order.status === 'refunded' ? 'bg-blue-100 text-blue-800' :
                      order.status === 'cancelled' ? 'bg-gray-100 text-gray-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {ORDER_STATUS_TEXT[order.status]}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-4">
                  <div>
                    <span className="font-medium">创建时间:</span>
                    <div>{formatTime(order.createdAt)}</div>
                  </div>
                  {order.paymentTime && (
                    <div>
                      <span className="font-medium">支付时间:</span>
                      <div>{formatTime(order.paymentTime)}</div>
                    </div>
                  )}
                  {order.paymentMethod && (
                    <div>
                      <span className="font-medium">支付方式:</span>
                      <div>{PAYMENT_METHOD_TEXT[order.paymentMethod]}</div>
                    </div>
                  )}
                  {order.status === 'pending' && (
                    <div>
                      <span className="font-medium">剩余时间:</span>
                      <div className={isOrderExpiringSoon(order.expireTime) ? 'text-red-600 font-medium' : ''}>
                        {getRemainingTime(order.expireTime)}
                      </div>
                    </div>
                  )}
                </div>

                {/* 操作按钮 */}
                <div className="flex gap-2 pt-4 border-t border-gray-200">
                  {order.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handlePay(order.id)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                      >
                        立即支付
                      </button>
                      <button
                        onClick={() => handleCancel(order.id)}
                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
                      >
                        取消订单
                      </button>
                    </>
                  )}
                  {order.status === 'paid' && (
                    <button
                      onClick={() => handleRefund(order.id)}
                      className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                    >
                      申请退款
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 分页 */}
        {totalPages > 1 && (
          <div className="mt-8 flex justify-center">
            <div className="flex space-x-2">
              <button
                onClick={() => loadOrders(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-2 bg-white border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                上一页
              </button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => loadOrders(page)}
                  className={`px-3 py-2 rounded-md ${
                    page === currentPage
                      ? 'bg-blue-600 text-white'
                      : 'bg-white border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              ))}
              
              <button
                onClick={() => loadOrders(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-2 bg-white border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                下一页
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderListPage;
