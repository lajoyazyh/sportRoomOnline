import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getActivityDetailApi } from '../../api/activity';

const API_BASE_URL = 'http://localhost:7001';

const ActivityType = {
  fitness: '健身',
  basketball: '篮球',
  football: '足球',
  badminton: '羽毛球',
  tennis: '网球',
  yoga: '瑜伽',
  swimming: '游泳',
  running: '跑步',
  other: '其他',
};

const ActivityStatus = {
  draft: '草稿',
  published: '已发布',
  ongoing: '进行中',
  completed: '已完成',
  cancelled: '已取消',
};

export default function ActivityDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activity, setActivity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [images, setImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentUser, setCurrentUser] = useState(null);
  const [registrationStatus, setRegistrationStatus] = useState(null);
  const [orderStatus, setOrderStatus] = useState(null);
  const [registering, setRegistering] = useState(false);

  useEffect(() => {
    fetchActivityDetail();
    fetchCurrentUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchCurrentUser = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/user/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setCurrentUser(data.data);
      }
    } catch (error) {
      console.error('获取用户信息失败:', error);
    }
  };

  const fetchRegistrationStatus = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      
      // 获取报名状态
      const registrationResponse = await fetch(`${API_BASE_URL}/api/registration/status/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (registrationResponse.ok) {
        const registrationData = await registrationResponse.json();
        setRegistrationStatus(registrationData.data);
        
        // 如果已报名且状态是approved，检查订单支付状态
        if (registrationData.data && registrationData.data.isRegistered && 
            registrationData.data.status === 'approved') {
          const orderResponse = await fetch(`${API_BASE_URL}/api/order/my?limit=100`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });
          
          if (orderResponse.ok) {
            const orderData = await orderResponse.json();
            
            // 查找与当前活动相关的订单
            const activityOrder = orderData.data.orders.find(order => 
              order.registration && order.registration.activityId === parseInt(id)
            );
            
            if (activityOrder) {
              setOrderStatus(activityOrder);
            }
          }
        }
      }
    } catch (error) {
      console.error('获取报名状态失败:', error);
    }
  }, [id]);

  const fetchActivityDetail = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getActivityDetailApi(id);
      
      if (response.success) {
        setActivity(response.data);
        
        // 处理图片
        if (response.data.images) {
          try {
            const parsedImages = JSON.parse(response.data.images);
            setImages(parsedImages);
          } catch {
            setImages([]);
          }
        }
        
        // 获取报名状态
        await fetchRegistrationStatus();
      } else {
        alert(response.message || '获取活动详情失败');
        navigate('/activity');
      }
    } catch (error) {
      console.error('获取活动详情失败:', error);
      alert('获取活动详情失败');
      navigate('/activity');
    } finally {
      setLoading(false);
    }
  }, [id, navigate, fetchRegistrationStatus]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('zh-CN');
  };

  const formatDateOnly = (dateString) => {
    return new Date(dateString).toLocaleDateString('zh-CN');
  };

  const formatTimeOnly = (dateString) => {
    return new Date(dateString).toLocaleTimeString('zh-CN', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      draft: 'bg-gray-100 text-gray-800',
      published: 'bg-green-100 text-green-800',
      ongoing: 'bg-blue-100 text-blue-800',
      completed: 'bg-purple-100 text-purple-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  // 获取报名按钮状态和文本
  const getRegistrationButtonStatus = () => {
    if (!activity || !currentUser) {
      return { show: false, disabled: true, text: '加载中...', reason: '正在加载活动信息' };
    }

    // 检查是否是自己创建的活动 - 显示为不可点击
    if (activity.creator && activity.creator.userid === currentUser.userid) {
      return { show: true, disabled: true, text: '您创建的活动', reason: '这是您创建的活动，可以在管理页面查看报名情况' };
    }

    // 检查活动状态 - 已结束/已取消的活动显示为不可点击
    if (activity.status === 'completed') {
      return { show: true, disabled: true, text: '活动已结束', reason: '活动已结束，无法报名' };
    }
    
    if (activity.status === 'cancelled') {
      return { show: true, disabled: true, text: '活动已取消', reason: '活动已取消，无法报名' };
    }
    
    if (activity.status !== 'published') {
      return { show: true, disabled: true, text: '活动未发布', reason: '活动尚未发布，无法报名' };
    }

    // 检查是否已经报名 - 显示具体报名状态
    if (registrationStatus && registrationStatus.isRegistered) {
      const status = registrationStatus.status;
      switch (status) {
        case 'pending':
          return { show: true, disabled: true, text: '审核中', reason: '您的报名正在审核中' };
        case 'approved':
          // 检查是否有已支付的订单
          if (orderStatus) {
            switch (orderStatus.status) {
              case 'paid':
                return { show: true, disabled: true, text: '已支付', reason: '您已完成支付，请按时参加活动' };
              case 'pending':
                return { show: true, disabled: true, text: '待支付', reason: '您有未支付的订单，请前往订单页面完成支付' };
              case 'cancelled':
              case 'expired':
                return { show: true, disabled: false, text: '重新报名', reason: '您的订单已取消或过期，可以重新报名' };
              case 'refunded':
                return { show: true, disabled: true, text: '已退款', reason: '您的订单已退款' };
              default:
                return { show: true, disabled: true, text: '已通过', reason: '您的报名已通过审核' };
            }
          }
          return { show: true, disabled: true, text: '已通过', reason: '您的报名已通过审核' };
        case 'rejected':
          return { show: true, disabled: false, text: '重新报名', reason: '您的报名已被拒绝，可以重新报名' };
        case 'cancelled':
          // 检查是否是因为退款而取消，如果是则禁止重新报名
          if (registrationStatus.hasRefunded) {
            return { show: true, disabled: true, text: '已退款', reason: '您已申请退款，因此无法重新报名此活动' };
          }
          return { show: true, disabled: false, text: '重新报名', reason: '您已取消报名，可以重新报名' };
        default:
          return { show: true, disabled: true, text: '已报名', reason: '您已报名此活动' };
      }
    }

    // 检查时间限制 - 活动已开始显示为不可点击
    const now = new Date();
    const startTime = new Date(activity.startTime);
    
    if (now >= startTime) {
      return { show: true, disabled: true, text: '活动已开始', reason: '活动已开始，无法报名' };
    }

    // 检查报名截止时间 - 显示已截止状态
    const registrationDeadline = new Date(activity.registrationDeadline);
    if (now >= registrationDeadline) {
      return { show: true, disabled: true, text: '报名已截止', reason: '报名截止时间已过' };
    }

    // 检查人数限制 - 显示已满状态
    if (activity.currentParticipants >= activity.maxParticipants) {
      return { show: true, disabled: true, text: '报名已满', reason: '活动人数已满' };
    }

    // 可以报名
    return { show: true, disabled: false, text: '立即报名', reason: '' };
  };

  // 处理分享活动
  const handleShare = async () => {
    try {
      // 检查是否支持Web Share API
      if (navigator.share) {
        await navigator.share({
          title: activity.title,
          text: `${activity.description.substring(0, 100)}...`,
          url: window.location.href,
        });
      } else {
        // 降级处理：复制链接到剪贴板
        await navigator.clipboard.writeText(window.location.href);
        alert('活动链接已复制到剪贴板！');
      }
    } catch (error) {
      console.error('分享失败:', error);
      // 如果剪贴板API也不支持，提供手动复制
      const textArea = document.createElement('textarea');
      textArea.value = window.location.href;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert('活动链接已复制到剪贴板！');
    }
  };

  // 处理报名
  const handleRegister = async () => {
    setRegistering(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/registration/apply`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          activityId: parseInt(id),
          message: '我要参加这个活动'
        }),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          alert('报名提交成功！请等待活动创建者审核。');
          // 重新获取活动信息和报名状态
          await fetchActivityDetail();
        } else {
          alert(result.message || '报名失败，请稍后重试');
        }
      } else {
        const error = await response.json();
        alert(error.message || '报名失败，请稍后重试');
      }
    } catch (error) {
      console.error('报名失败:', error);
      alert('网络错误，请稍后重试');
    } finally {
      setRegistering(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">加载中...</p>
        </div>
      </div>
    );
  }

  if (!activity) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">活动不存在</h3>
          <p className="text-gray-500 mb-4">该活动可能已被删除或不存在</p>
          <Link
            to="/activity"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors"
          >
            返回活动列表
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 返回按钮 */}
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
          >
            <span className="mr-2">←</span>
            返回
          </button>
        </div>

        {/* 活动详情卡片 */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* 图片展示区域 */}
          {images.length > 0 && (
            <div className="relative h-64 md:h-96">
              <img
                src={images[currentImageIndex]}
                alt={activity.title}
                className="w-full h-full object-cover"
              />
              
              {/* 图片导航 */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={() => setCurrentImageIndex(prev => 
                      prev === 0 ? images.length - 1 : prev - 1
                    )}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
                  >
                    ←
                  </button>
                  <button
                    onClick={() => setCurrentImageIndex(prev => 
                      prev === images.length - 1 ? 0 : prev + 1
                    )}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
                  >
                    →
                  </button>
                  
                  {/* 图片指示器 */}
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                    {images.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`w-3 h-3 rounded-full transition-all ${
                          index === currentImageIndex 
                            ? 'bg-white' 
                            : 'bg-white bg-opacity-50'
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
              
              {/* 状态标签 */}
              <div className="absolute top-4 right-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(activity.status)}`}>
                  {ActivityStatus[activity.status]}
                </span>
              </div>
            </div>
          )}

          {/* 活动信息 */}
          <div className="p-8">
            {/* 标题和类型 */}
            <div className="mb-6">
              <div className="flex items-center mb-4">
                <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full mr-4">
                  {ActivityType[activity.type]}
                </span>
                <span className="text-sm text-gray-500">
                  👁 {activity.viewCount} 次浏览
                </span>
              </div>
              
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {activity.title}
              </h1>
              
              <p className="text-gray-600 text-lg leading-relaxed">
                {activity.description}
              </p>
            </div>

            {/* 活动信息网格 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* 基本信息 */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                  基本信息
                </h3>
                
                <div className="space-y-3">
                  <div className="flex items-center">
                    <span className="text-gray-500 mr-3">📍</span>
                    <span className="font-medium">地点：</span>
                    <span className="ml-2">{activity.location}</span>
                  </div>
                  
                  <div className="flex items-center">
                    <span className="text-gray-500 mr-3">📅</span>
                    <span className="font-medium">日期：</span>
                    <span className="ml-2">{formatDateOnly(activity.startTime)}</span>
                  </div>
                  
                  <div className="flex items-center">
                    <span className="text-gray-500 mr-3">⏰</span>
                    <span className="font-medium">时间：</span>
                    <span className="ml-2">
                      {formatTimeOnly(activity.startTime)} - {formatTimeOnly(activity.endTime)}
                    </span>
                  </div>
                  
                  <div className="flex items-center">
                    <span className="text-gray-500 mr-3">⏳</span>
                    <span className="font-medium">报名截止：</span>
                    <span className="ml-2">{formatDate(activity.registrationDeadline)}</span>
                  </div>
                </div>
              </div>

              {/* 参与信息 */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                  参与信息
                </h3>
                
                <div className="space-y-3">
                  <div className="flex items-center">
                    <span className="text-gray-500 mr-3">👥</span>
                    <span className="font-medium">人数限制：</span>
                    <span className="ml-2">{activity.minParticipants} - {activity.maxParticipants} 人</span>
                  </div>
                  
                  <div className="flex items-center">
                    <span className="text-gray-500 mr-3">✅</span>
                    <span className="font-medium">已报名：</span>
                    <span className="ml-2 text-blue-600 font-semibold">
                      {activity.currentParticipants} 人
                    </span>
                  </div>
                  
                  <div className="flex items-center">
                    <span className="text-gray-500 mr-3">💰</span>
                    <span className="font-medium">费用：</span>
                    <span className="ml-2">
                      {activity.fee > 0 ? (
                        <span className="text-orange-600 font-semibold">¥{activity.fee}</span>
                      ) : (
                        <span className="text-green-600 font-semibold">免费</span>
                      )}
                    </span>
                  </div>
                  
                  {activity.contactInfo && (
                    <div className="flex items-center">
                      <span className="text-gray-500 mr-3">📞</span>
                      <span className="font-medium">联系方式：</span>
                      <span className="ml-2">{activity.contactInfo}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 详细信息 */}
            {(activity.requirements || activity.equipment) && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2 mb-4">
                  详细信息
                </h3>
                
                {activity.requirements && (
                  <div className="mb-4">
                    <h4 className="font-medium text-gray-900 mb-2">参与要求：</h4>
                    <p className="text-gray-600 leading-relaxed">{activity.requirements}</p>
                  </div>
                )}
                
                {activity.equipment && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">所需设备：</h4>
                    <p className="text-gray-600 leading-relaxed">{activity.equipment}</p>
                  </div>
                )}
              </div>
            )}

            {/* 组织者信息 */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2 mb-4">
                组织者
              </h3>
              
              <div className="flex items-center">
                <img
                  src={activity.creator.avatar || '/default-avatar.png'}
                  alt={activity.creator.nickname || activity.creator.username}
                  className="w-12 h-12 rounded-full mr-4"
                />
                <div>
                  <p className="font-medium text-gray-900">
                    {activity.creator.nickname || activity.creator.username}
                  </p>
                  <p className="text-sm text-gray-500">
                    创建于 {formatDate(activity.createdAt)}
                  </p>
                </div>
              </div>
            </div>

            {/* 操作按钮 */}
            <div className="flex justify-center space-x-4">
              {(() => {
                const buttonStatus = getRegistrationButtonStatus();
                return (
                  <>
                    {/* 报名相关按钮 */}
                    <div className="flex flex-col items-center">
                      {buttonStatus.show ? (
                        <>
                          <button 
                            onClick={buttonStatus.disabled ? undefined : handleRegister}
                            disabled={buttonStatus.disabled || registering}
                            className={`px-8 py-3 rounded-lg text-lg font-medium transition-colors ${
                              buttonStatus.disabled 
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                                : 'bg-blue-600 text-white hover:bg-blue-700'
                            }`}
                          >
                            {registering ? '报名中...' : buttonStatus.text}
                          </button>
                          {buttonStatus.reason && (
                            <p className="text-sm text-gray-500 mt-2">{buttonStatus.reason}</p>
                          )}
                        </>
                      ) : (
                        <div className="text-center">
                          <p className="text-gray-500 text-lg mb-2">暂不可报名</p>
                          <p className="text-sm text-gray-400">
                            {buttonStatus.reason || '该活动当前不开放报名'}
                          </p>
                        </div>
                      )}
                    </div>
                    
                    {/* 其他操作按钮 */}
                    <button 
                      onClick={handleShare}
                      className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg text-lg font-medium hover:bg-gray-50 transition-colors"
                    >
                      分享活动
                    </button>
                    
                    <Link
                      to="/home/square"
                      className="border border-blue-600 text-blue-600 px-8 py-3 rounded-lg text-lg font-medium hover:bg-blue-50 transition-colors"
                    >
                      回到活动广场
                    </Link>
                  </>
                );
              })()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
