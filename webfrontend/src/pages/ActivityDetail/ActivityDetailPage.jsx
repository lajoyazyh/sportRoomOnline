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
      const response = await fetch(`${API_BASE_URL}/api/registration/status/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setRegistrationStatus(data.data);
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
    console.log('=== 按钮状态检查 ===');
    console.log('activity:', activity);
    console.log('currentUser:', currentUser);
    console.log('registrationStatus:', registrationStatus);
    
    if (!activity || !currentUser) {
      console.log('活动或用户信息未加载');
      return { show: false, disabled: true, text: '加载中...', reason: '正在加载活动信息' };
    }

    // 检查是否是自己创建的活动 - 不显示按钮
    if (activity.creator && activity.creator.userid === currentUser.userid) {
      console.log('自己创建的活动，不显示按钮');
      return { show: false, disabled: true, text: '自己创建的活动', reason: '这是您创建的活动' };
    }

    // 检查活动状态 - 已结束/已取消的活动不显示按钮
    console.log('活动状态:', activity.status);
    if (activity.status === 'completed') {
      console.log('活动已结束，不显示按钮');
      return { show: false, disabled: true, text: '活动已结束', reason: '活动已结束' };
    }
    
    if (activity.status === 'cancelled') {
      console.log('活动已取消，不显示按钮');
      return { show: false, disabled: true, text: '活动已取消', reason: '活动已取消' };
    }
    
    if (activity.status !== 'published') {
      console.log('活动未发布，不显示按钮');
      return { show: false, disabled: true, text: '活动未发布', reason: '活动尚未发布' };
    }

    // 检查是否已经报名 - 显示已报名状态
    if (registrationStatus && registrationStatus.isRegistered) {
      console.log('已报名，显示已报名状态');
      return { show: true, disabled: true, text: '已报名', reason: '您已报名此活动' };
    }

    // 检查时间限制 - 活动已开始不显示按钮
    const now = new Date();
    const startTime = new Date(activity.startTime);
    console.log('当前时间:', now);
    console.log('活动开始时间:', startTime);
    
    if (now >= startTime) {
      console.log('活动已开始，不显示按钮');
      return { show: false, disabled: true, text: '活动已开始', reason: '活动已开始，无法报名' };
    }

    // 检查报名截止时间 - 显示已截止状态
    const registrationDeadline = new Date(activity.registrationDeadline);
    console.log('报名截止时间:', registrationDeadline);
    if (now >= registrationDeadline) {
      console.log('报名已截止，显示已截止状态');
      return { show: true, disabled: true, text: '报名已截止', reason: '报名截止时间已过' };
    }

    // 检查人数限制 - 显示已满状态
    console.log('当前人数:', activity.currentParticipants, '最大人数:', activity.maxParticipants);
    if (activity.currentParticipants >= activity.maxParticipants) {
      console.log('人数已满，显示已满状态');
      return { show: true, disabled: true, text: '报名已满', reason: '活动人数已满' };
    }

    // 可以报名
    console.log('可以报名，显示立即报名按钮');
    return { show: true, disabled: false, text: '立即报名', reason: '' };
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
                        {buttonStatus.disabled && buttonStatus.reason && (
                          <p className="text-sm text-gray-500 mt-2">{buttonStatus.reason}</p>
                        )}
                      </>
                    ) : (
                      buttonStatus.reason && (
                        <div className="text-center">
                          <p className="text-gray-500 text-lg mb-2">{buttonStatus.reason}</p>
                          <p className="text-sm text-gray-400">
                            {buttonStatus.text === '自己创建的活动' && '您可以在管理页面查看报名情况'}
                            {buttonStatus.text === '活动已结束' && '感谢您的关注'}
                            {buttonStatus.text === '活动已取消' && '很抱歉给您带来不便'}
                            {buttonStatus.text === '活动未发布' && '活动尚未开放报名'}
                            {buttonStatus.text === '活动已开始' && '错过了报名时间'}
                          </p>
                        </div>
                      )
                    )}
                  </div>
                );
              })()}
              
              <button className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg text-lg font-medium hover:bg-gray-50 transition-colors">
                分享活动
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
