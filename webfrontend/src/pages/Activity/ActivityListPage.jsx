import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { getActivityListApi } from '../../api/activity';

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
  // ongoing: '进行中',
  // completed: '已完成',
  // cancelled: '已取消',
};

export default function ActivityListPage() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 12,
    total: 0,
    totalPages: 0,
  });
  const [filters, setFilters] = useState({
    search: '',
    type: '',
    status: 'published',
    sortBy: 'createdAt',
    sortOrder: 'DESC',
  });

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  const fetchActivities = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.page,
        pageSize: pagination.pageSize,
        ...filters,
      };
      
      // 清除空值
      Object.keys(params).forEach(key => {
        if (params[key] === '') delete params[key];
      });

      const response = await getActivityListApi(params);
      
      if (response.success) {
        setActivities(response.data.list);
        setPagination(prev => ({
          ...prev,
          total: response.data.total,
          totalPages: response.data.totalPages,
        }));
      }
    } catch (error) {
      console.error('获取活动列表失败:', error);
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.pageSize, filters]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('zh-CN');
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

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 页面标题 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">体育活动</h1>
          <p className="mt-2 text-gray-600">发现并参与各种精彩的体育活动</p>
        </div>

        {/* 筛选栏 */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* 搜索框 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                搜索活动
              </label>
              <input
                type="text"
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                placeholder="搜索活动标题、描述或地点..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* 活动类型 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                活动类型
              </label>
              <select
                value={filters.type}
                onChange={(e) => handleFilterChange('type', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">全部类型</option>
                {Object.entries(ActivityType).map(([key, value]) => (
                  <option key={key} value={key}>{value}</option>
                ))}
              </select>
            </div>

            {/* 排序方式 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                排序方式
              </label>
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="createdAt">创建时间</option>
                <option value="startTime">开始时间</option>
                <option value="viewCount">浏览量</option>
                <option value="likeCount">点赞数</option>
              </select>
            </div>

            {/* 创建活动按钮 */}
            <div className="flex items-end">
              <Link
                to="/activity/create"
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-center"
              >
                创建活动
              </Link>
            </div>
          </div>
        </div>

        {/* 活动列表 */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600">加载中...</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {activities.map((activity) => (
                <div key={activity.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  {/* 活动图片 */}
                  <div className="h-48 bg-gray-200 relative">
                    {activity.images ? (
                      <img
                        src={JSON.parse(activity.images)[0]}
                        alt={activity.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-500">
                        <span className="text-4xl">🏃‍♂️</span>
                      </div>
                    )}
                    <div className="absolute top-2 right-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(activity.status)}`}>
                        {ActivityStatus[activity.status]}
                      </span>
                    </div>
                  </div>

                  {/* 活动信息 */}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                        {ActivityType[activity.type]}
                      </span>
                      <span className="text-sm text-gray-500">
                        👁 {activity.viewCount}
                      </span>
                    </div>

                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                      {activity.title}
                    </h3>

                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {activity.description}
                    </p>

                    <div className="space-y-2 text-sm text-gray-500">
                      <div className="flex items-center">
                        <span className="mr-2">📍</span>
                        <span>{activity.location}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="mr-2">⏰</span>
                        <span>{formatDate(activity.startTime)}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="mr-2">👥</span>
                        <span>{activity.currentParticipants}/{activity.maxParticipants}人</span>
                      </div>
                      {activity.fee > 0 && (
                        <div className="flex items-center">
                          <span className="mr-2">💰</span>
                          <span className="text-orange-600 font-medium">¥{activity.fee}</span>
                        </div>
                      )}
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center text-sm text-gray-500">
                        <img
                          src={activity.creator.avatar || '/default-avatar.png'}
                          alt={activity.creator.nickname || activity.creator.username}
                          className="w-6 h-6 rounded-full mr-2"
                        />
                        <span>{activity.creator.nickname || activity.creator.username}</span>
                      </div>
                      
                      <Link
                        to={`/activity/${activity.id}`}
                        className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700 transition-colors"
                      >
                        查看详情
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* 分页 */}
            {pagination.totalPages > 1 && (
              <div className="flex justify-center">
                <nav className="flex items-center space-x-2">
                  <button
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page <= 1}
                    className="px-3 py-2 rounded-md bg-white border border-gray-300 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    上一页
                  </button>
                  
                  {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-3 py-2 rounded-md ${
                        page === pagination.page
                          ? 'bg-blue-600 text-white'
                          : 'bg-white border border-gray-300 text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page >= pagination.totalPages}
                    className="px-3 py-2 rounded-md bg-white border border-gray-300 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    下一页
                  </button>
                </nav>
              </div>
            )}

            {activities.length === 0 && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🏃‍♂️</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">暂无活动</h3>
                <p className="text-gray-500 mb-4">还没有发布的活动，快来创建第一个活动吧！</p>
                <Link
                  to="/activity/create"
                  className="inline-block bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors"
                >
                  创建活动
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
