import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getActivityDetailApi } from '../../api/activity';

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

  useEffect(() => {
    fetchActivityDetail();
  }, [id]);

  const fetchActivityDetail = async () => {
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
  };

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

  const canRegister = (activity) => {
    if (!activity) return false;
    
    const now = new Date();
    const registrationDeadline = new Date(activity.registrationDeadline);
    const startTime = new Date(activity.startTime);
    
    return (
      activity.status === 'published' &&
      now < registrationDeadline &&
      now < startTime &&
      activity.currentParticipants < activity.maxParticipants
    );
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
              {canRegister(activity) ? (
                <button className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-blue-700 transition-colors">
                  立即报名
                </button>
              ) : (
                <button 
                  disabled 
                  className="bg-gray-300 text-gray-500 px-8 py-3 rounded-lg text-lg font-medium cursor-not-allowed"
                >
                  {activity.status === 'completed' ? '活动已结束' : 
                   activity.status === 'cancelled' ? '活动已取消' :
                   activity.currentParticipants >= activity.maxParticipants ? '报名已满' :
                   new Date() >= new Date(activity.registrationDeadline) ? '报名已截止' : '无法报名'}
                </button>
              )}
              
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
