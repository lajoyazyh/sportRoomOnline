// SquarePage.jsx
// 活动广场页面 - 公共活动浏览区域
// 所有用户都可以浏览和搜索活动

import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';

const API_BASE_URL = 'http://localhost:7001';

function SquarePage() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // 活动类型选项
  const activityTypes = [
    { value: '', label: '全部类型' },
    { value: 'fitness', label: '健身' },
    { value: 'basketball', label: '篮球' },
    { value: 'football', label: '足球' },
    { value: 'badminton', label: '羽毛球' },
    { value: 'tennis', label: '网球' },
    { value: 'yoga', label: '瑜伽' },
    { value: 'swimming', label: '游泳' },
    { value: 'running', label: '跑步' },
    { value: 'other', label: '其他' }
  ];

  // 活动状态选项
  const activityStatuses = [
    { value: '', label: '全部状态' },
    { value: 'draft', label: '草稿' },
    { value: 'published', label: '已发布' },
    { value: 'ongoing', label: '进行中' },
    { value: 'completed', label: '已完成' },
    { value: 'cancelled', label: '已取消' }
  ];

  // 获取活动列表
  const fetchActivities = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        pageSize: '9'
      });
      
      if (searchTerm) params.append('search', searchTerm);
      if (filterType) params.append('type', filterType);
      if (filterStatus) params.append('status', filterStatus);

      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/activity/list?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setActivities(data.data.list || []);
        setTotalPages(data.data.totalPages || 1);
      } else {
        console.error('获取活动列表失败');
      }
    } catch (error) {
      console.error('网络错误:', error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchTerm, filterType, filterStatus]);

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  // 搜索处理
  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchActivities();
  };

  // 格式化时间
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('zh-CN');
  };

  // 获取活动类型标签
  const getTypeLabel = (type) => {
    const typeOption = activityTypes.find(t => t.value === type);
    return typeOption ? typeOption.label : type;
  };

  // 获取状态标签
  const getStatusLabel = (status) => {
    const statusOption = activityStatuses.find(s => s.value === status);
    return statusOption ? statusOption.label : status;
  };

  // 获取状态颜色
  const getStatusColor = (status) => {
    const colors = {
      published: 'bg-green-100 text-green-800',
      ongoing: 'bg-blue-100 text-blue-800',
      completed: 'bg-gray-100 text-gray-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">活动广场</h1>
        <p className="text-gray-600">发现精彩的体育活动，开始你的运动之旅</p>
      </div>

      {/* 搜索和筛选区域 */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <form onSubmit={handleSearch} className="flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-[300px]">
            <label className="block text-sm font-medium text-gray-700 mb-2">搜索活动</label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="搜索活动标题或描述..."
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div className="min-w-[150px]">
            <label className="block text-sm font-medium text-gray-700 mb-2">活动类型</label>
            <select
              value={filterType}
              onChange={(e) => {
                setFilterType(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {activityTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div className="min-w-[150px]">
            <label className="block text-sm font-medium text-gray-700 mb-2">活动状态</label>
            <select
              value={filterStatus}
              onChange={(e) => {
                setFilterStatus(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {activityStatuses.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            搜索
          </button>
        </form>
      </div>

      {/* 活动列表 */}
      <div className="mb-6">
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">加载中...</p>
          </div>
        ) : activities.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🏃‍♂️</div>
            <p className="text-gray-600 text-lg">暂无活动</p>
            <p className="text-gray-500 text-sm mt-2">调整搜索条件或稍后再试</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activities.map((activity) => (
              <div key={activity.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                {/* 活动图片 */}
                <div className="h-48 bg-gray-200 relative overflow-hidden">
                  {activity.images && JSON.parse(activity.images).length > 0 ? (
                    <img
                      src={JSON.parse(activity.images)[0]}
                      alt={activity.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <div className="text-4xl">🏃‍♂️</div>
                    </div>
                  )}
                  <div className="absolute top-3 right-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(activity.status)}`}>
                      {getStatusLabel(activity.status)}
                    </span>
                  </div>
                </div>

                {/* 活动信息 */}
                <div className="p-6">
                  <div className="mb-2">
                    <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      {getTypeLabel(activity.type)}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-semibold text-gray-800 mb-2 line-clamp-1">
                    {activity.title}
                  </h3>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {activity.description}
                  </p>

                  <div className="space-y-2 text-sm text-gray-500 mb-4">
                    <div className="flex items-center">
                      <span className="w-4 h-4 mr-2">📍</span>
                      <span className="truncate">{activity.location}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="w-4 h-4 mr-2">⏰</span>
                      <span>{formatDate(activity.startTime)}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="w-4 h-4 mr-2">👥</span>
                      <span>{activity.currentParticipants}/{activity.maxParticipants}人</span>
                    </div>
                    {activity.fee > 0 && (
                      <div className="flex items-center">
                        <span className="w-4 h-4 mr-2">💰</span>
                        <span className="text-orange-600 font-medium">¥{activity.fee}</span>
                      </div>
                    )}
                  </div>

                  <Link
                    to={`/activity/${activity.id}`}
                    className="block w-full text-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors no-underline"
                  >
                    查看详情
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 分页 */}
      {totalPages > 1 && (
        <div className="flex justify-center space-x-2">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            上一页
          </button>
          
          <span className="px-4 py-2 text-gray-700">
            第 {currentPage} 页，共 {totalPages} 页
          </span>
          
          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            下一页
          </button>
        </div>
      )}
    </div>
  );
}

export default SquarePage;