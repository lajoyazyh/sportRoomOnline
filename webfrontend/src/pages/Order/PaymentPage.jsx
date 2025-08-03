import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { orderAPI, PAYMENT_METHOD, PAYMENT_METHOD_TEXT } from '../../api/order';

const PaymentPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState(PAYMENT_METHOD.MOCK);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState('');
  const [timeLeft, setTimeLeft] = useState(0);

  // 加载订单详情
  const loadOrder = useCallback(async () => {
    try {
      setLoading(true);
      const response = await orderAPI.getOrder(orderId);
      
      if (response.success) {
        setOrder(response.data);
        // 计算剩余时间
        if (response.data.expireTime) {
          const remaining = new Date(response.data.expireTime) - new Date();
          setTimeLeft(Math.max(0, remaining));
        }
      } else {
        setError(response.message || '获取订单信息失败');
      }
    } catch (error) {
      console.error('加载订单失败:', error);
      setError('网络错误，请稍后重试');
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  // 处理支付
  const handlePayment = async () => {
    if (paying) return;

    setPaying(true);
    try {
      const response = await orderAPI.payOrder(orderId, paymentMethod);
      
      if (response.success) {
        alert('支付成功！');
        navigate('/home/profile'); // 跳转到个人中心
      } else {
        alert(response.message || '支付失败');
      }
    } catch (error) {
      console.error('支付失败:', error);
      alert('支付失败，请稍后重试');
    } finally {
      setPaying(false);
    }
  };

  // 取消支付
  const handleCancel = () => {
    if (confirm('确定要取消支付吗？')) {
      navigate(-1); // 返回上一页
    }
  };

  // 格式化时间
  const formatTime = (timeString) => {
    if (!timeString) return '-';
    const date = new Date(timeString);
    return date.toLocaleString('zh-CN');
  };

  // 格式化剩余时间
  const formatTimeLeft = (milliseconds) => {
    if (milliseconds <= 0) return '已过期';
    
    const minutes = Math.floor(milliseconds / (1000 * 60));
    const seconds = Math.floor((milliseconds % (1000 * 60)) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // 倒计时效果
  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        const newTime = prev - 1000;
        if (newTime <= 0) {
          setError('订单已过期');
          clearInterval(timer);
        }
        return Math.max(0, newTime);
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  useEffect(() => {
    if (orderId) {
      loadOrder();
    }
  }, [orderId, loadOrder]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-600">加载中...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 mb-4">{error}</div>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
          >
            返回
          </button>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-600">订单不存在</div>
        </div>
      </div>
    );
  }

  const isExpired = timeLeft <= 0;
  const isExpiringSoon = timeLeft > 0 && timeLeft < 5 * 60 * 1000; // 5分钟内

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">
        {/* 页面标题 */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">订单支付</h1>
          <p className="text-gray-600 mt-1">请在订单过期前完成支付</p>
        </div>

        {/* 倒计时提醒 */}
        {!isExpired && (
          <div className={`mb-6 p-4 rounded-md ${
            isExpiringSoon ? 'bg-red-50 border border-red-200' : 'bg-yellow-50 border border-yellow-200'
          }`}>
            <div className={`text-center ${isExpiringSoon ? 'text-red-600' : 'text-yellow-800'}`}>
              <div className="font-medium">订单剩余时间</div>
              <div className="text-2xl font-bold mt-1">
                {formatTimeLeft(timeLeft)}
              </div>
            </div>
          </div>
        )}

        {/* 订单信息 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">订单信息</h2>
          
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-600">活动名称:</span>
              <span className="font-medium">{order.activity?.title}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">订单号:</span>
              <span className="font-mono text-sm">{order.orderNo}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">创建时间:</span>
              <span>{formatTime(order.createdAt)}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">过期时间:</span>
              <span className={isExpiringSoon ? 'text-red-600 font-medium' : ''}>
                {formatTime(order.expireTime)}
              </span>
            </div>
            
            <div className="border-t pt-4 flex justify-between items-center">
              <span className="text-lg font-medium text-gray-900">支付金额:</span>
              <span className="text-2xl font-bold text-red-600">¥{order.amount}</span>
            </div>
          </div>
        </div>

        {/* 支付方式选择 */}
        {!isExpired && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">选择支付方式</h2>
            
            <div className="space-y-3">
              {Object.entries(PAYMENT_METHOD).map(([key, value]) => (
                <label key={key} className="flex items-center p-3 border border-gray-200 rounded-md cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={value}
                    checked={paymentMethod === value}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mr-3"
                  />
                  <div className="flex-1">
                    <div className="font-medium">{PAYMENT_METHOD_TEXT[value]}</div>
                    {value === PAYMENT_METHOD.MOCK && (
                      <div className="text-sm text-gray-500">用于开发测试，点击即可完成支付</div>
                    )}
                  </div>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* 操作按钮 */}
        <div className="flex gap-4">
          <button
            onClick={handleCancel}
            className="flex-1 px-6 py-3 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
          >
            取消支付
          </button>
          
          {!isExpired && (
            <button
              onClick={handlePayment}
              disabled={paying}
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {paying ? '支付中...' : `立即支付 ¥${order.amount}`}
            </button>
          )}
        </div>

        {/* 支付说明 */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>这是一个演示系统，模拟支付不会产生实际费用</p>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
