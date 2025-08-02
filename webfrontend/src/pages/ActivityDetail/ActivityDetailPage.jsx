// ActivityDetailPage.jsx
// 活动详情页面 - 查看活动完整信息并支持报名

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';

const API_BASE_URL = 'http://localhost:7001';

function ActivityDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activity, setActivity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // 获取活动详情
  const fetchActivity = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/activity/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setActivity(data.data);
      } else {
        console.error('获取活动详情失败');
        alert('活动不存在或已被删除');
        navigate('/home/square');
      }
    } catch (error) {
      console.error('网络错误:', error);
      alert('网络错误，请稍后重试');
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    if (id) {
      fetchActivity();
    }
  }, [id, fetchActivity]);

  // 报名活动
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
          alert('报名成功！');
          // 重新获取活动信息以更新报名人数
          await fetchActivity();
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

  // 格式化时间
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // 获取活动类型标签
  const getTypeLabel = (type) => {
    const types = {
      fitness: '健身',
      basketball: '篮球',
      football: '足球',
      badminton: '羽毛球',
      tennis: '网球',
      yoga: '瑜伽',
      swimming: '游泳',
      running: '跑步',
      other: '其他'
    };
    return types[type] || type;
  };

  // 获取状态颜色
  const getStatusColor = (status) => {
    const colors = {
      draft: 'bg-gray-100 text-gray-800',
      published: 'bg-green-100 text-green-800',
      ongoing: 'bg-blue-100 text-blue-800',
      completed: 'bg-purple-100 text-purple-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  // 获取状态文本
  const getStatusText = (status) => {
    const statusMap = {
      draft: '草稿',
      published: '已发布',
      ongoing: '进行中',
      completed: '已完成',
      cancelled: '已取消'
    };
    return statusMap[status] || status;
  };

  // 检查是否可以报名
  const canRegister = (activity) => {
    if (!activity) return false;
    if (activity.status !== 'published') return false;
    if (activity.currentParticipants >= activity.maxParticipants) return false;
    if (new Date(activity.registrationDeadline) < new Date()) return false;
    return true;
  };

  if (loading) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">加载中...</p>
        </div>
      </div>
    );
  }

  if (!activity) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">😕</div>
          <p className="text-gray-600 text-lg">活动不存在</p>
          <Link
            to="/home/square"
            className="inline-block mt-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors no-underline"
          >
            返回活动广场
          </Link>
        </div>
      </div>
    );
  }

  const images = activity.images ? JSON.parse(activity.images) : [];

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* 返回按钮 */}
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
        >
          <span className="mr-2">←</span>
          返回
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {/* 图片轮播 */}
        {images.length > 0 && (
          <div className="relative h-64 md:h-96 bg-gray-200">
            <img
              src={images[currentImageIndex]}
              alt={activity.title}
              className="w-full h-full object-cover"
            />
            
            {images.length > 1 && (
              <>
                <button
                  onClick={() => setCurrentImageIndex((currentImageIndex - 1 + images.length) % images.length)}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70"
                >
                  ←
                </button>
                <button
                  onClick={() => setCurrentImageIndex((currentImageIndex + 1) % images.length)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70"
                >
                  →
                </button>
                
                {/* 图片指示器 */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                  {images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-2 h-2 rounded-full ${
                        index === currentImageIndex ? 'bg-white' : 'bg-white bg-opacity-50'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        <div className="p-6">
          {/* 头部信息 */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                  {getTypeLabel(activity.type)}
                </span>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(activity.status)}`}>
                  {getStatusText(activity.status)}
                </span>
              </div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">{activity.title}</h1>
            </div>
            
            {activity.fee > 0 && (
              <div className="text-right">
                <div className="text-2xl font-bold text-orange-600">¥{activity.fee}</div>
                <div className="text-sm text-gray-500">活动费用</div>
              </div>
            )}
          </div>

          {/* 关键信息卡片 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <div className="text-2xl mb-1">📍</div>
              <div className="text-sm text-gray-600">活动地点</div>
              <div className="font-medium">{activity.location}</div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <div className="text-2xl mb-1">⏰</div>
              <div className="text-sm text-gray-600">开始时间</div>
              <div className="font-medium">{formatDate(activity.startTime)}</div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <div className="text-2xl mb-1">👥</div>
              <div className="text-sm text-gray-600">参与人数</div>
              <div className="font-medium">
                {activity.currentParticipants}/{activity.maxParticipants}人
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <div className="text-2xl mb-1">📅</div>
              <div className="text-sm text-gray-600">报名截止</div>
              <div className="font-medium">{formatDate(activity.registrationDeadline)}</div>
            </div>
          </div>

          {/* 活动描述 */}
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">活动描述</h3>
            <div className="text-gray-600 whitespace-pre-wrap">{activity.description}</div>
          </div>

          {/* 详细信息 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">时间安排</h4>
              <div className="space-y-2 text-sm text-gray-600">
                <div>开始：{formatDate(activity.startTime)}</div>
                <div>结束：{formatDate(activity.endTime)}</div>
                <div>报名截止：{formatDate(activity.registrationDeadline)}</div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">参与信息</h4>
              <div className="space-y-2 text-sm text-gray-600">
                <div>最少人数：{activity.minParticipants}人</div>
                <div>最多人数：{activity.maxParticipants}人</div>
                <div>当前报名：{activity.currentParticipants}人</div>
              </div>
            </div>
          </div>

          {/* 可选信息 */}
          {(activity.requirements || activity.equipment || activity.contactInfo) && (
            <div className="border-t pt-6 mb-6">
              {activity.requirements && (
                <div className="mb-4">
                  <h4 className="font-semibold text-gray-800 mb-2">参与要求</h4>
                  <div className="text-gray-600 whitespace-pre-wrap">{activity.requirements}</div>
                </div>
              )}
              
              {activity.equipment && (
                <div className="mb-4">
                  <h4 className="font-semibold text-gray-800 mb-2">所需设备</h4>
                  <div className="text-gray-600 whitespace-pre-wrap">{activity.equipment}</div>
                </div>
              )}
              
              {activity.contactInfo && (
                <div className="mb-4">
                  <h4 className="font-semibold text-gray-800 mb-2">联系方式</h4>
                  <div className="text-gray-600">{activity.contactInfo}</div>
                </div>
              )}
            </div>
          )}

          {/* 操作按钮 */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t">
            {canRegister(activity) ? (
              <button
                onClick={handleRegister}
                disabled={registering}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                {registering ? '报名中...' : '立即报名'}
              </button>
            ) : (
              <div className="flex-1 px-6 py-3 bg-gray-100 text-gray-500 rounded-lg text-center font-medium">
                {activity.status === 'cancelled' && '活动已取消'}
                {activity.status === 'completed' && '活动已结束'}
                {activity.currentParticipants >= activity.maxParticipants && '人数已满'}
                {new Date(activity.registrationDeadline) < new Date() && '报名已截止'}
                {activity.status === 'draft' && '活动未发布'}
              </div>
            )}
            
            <Link
              to="/home/square"
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-center no-underline font-medium"
            >
              返回活动广场
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ActivityDetailPage;
