// ManagePage.jsx  
// 活动管理页面 - 个人活动管理中心
// 管理我创建的活动和我参与的活动

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const API_BASE_URL = 'http://localhost:7001';

function ManagePage() {
  const [myActivities, setMyActivities] = useState([]);
  const [joinedActivities, setJoinedActivities] = useState([]);
  const [activeTab, setActiveTab] = useState('created'); // 'created' | 'joined'
  const [loading, setLoading] = useState(false);

  // 获取我创建的活动
  const fetchMyActivities = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/activity/my/activities`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setMyActivities(data.data?.list || []);
      } else {
        console.error('获取我的活动失败');
      }
    } catch (error) {
      console.error('网络错误:', error);
    } finally {
      setLoading(false);
    }
  };

  // 获取我参与的活动
  const fetchJoinedActivities = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/registration/my`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setJoinedActivities(data.data || []);
      } else {
        console.error('获取我参与的活动失败');
      }
    } catch (error) {
      console.error('网络错误:', error);
    }
  };

  useEffect(() => {
    if (activeTab === 'created') {
      fetchMyActivities();
    } else {
      fetchJoinedActivities();
    }
  }, [activeTab]);

  // 删除活动
  const handleDeleteActivity = async (activityId) => {
    if (!confirm('确定要删除这个活动吗？此操作不可撤销。')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/activity/${activityId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        alert('活动删除成功');
        fetchMyActivities(); // 重新获取列表
      } else {
        alert('删除失败，请稍后重试');
      }
    } catch (error) {
      console.error('删除活动失败:', error);
      alert('删除失败，网络错误');
    }
  };

  // 发布活动
  const handlePublishActivity = async (activityId) => {
    if (!confirm('确定要发布这个活动吗？发布后其他用户就可以看到并报名了。')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/activity/${activityId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: 'published'
        }),
      });

      if (response.ok) {
        alert('活动发布成功！');
        fetchMyActivities(); // 重新获取列表
      } else {
        const result = await response.json();
        alert(result.message || '发布失败，请稍后重试');
      }
    } catch (error) {
      console.error('发布活动失败:', error);
      alert('发布失败，网络错误');
    }
  };

  // 格式化时间
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('zh-CN');
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

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">活动管理</h1>
        <p className="text-gray-600">管理您创建和参与的活动</p>
      </div>

      {/* 快速操作按钮 */}
      <div className="mb-6">
        <Link
          to="/activity/create"
          className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors no-underline"
        >
          <span className="mr-2">➕</span>
          创建新活动
        </Link>
      </div>

      {/* 标签页切换 */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('created')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'created'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              我创建的活动 ({myActivities.length})
            </button>
            <button
              onClick={() => setActiveTab('joined')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'joined'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              我参与的活动 ({joinedActivities.length})
            </button>
          </nav>
        </div>
      </div>

      {/* 内容区域 */}
      <div className="bg-white rounded-lg shadow-sm">
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">加载中...</p>
          </div>
        ) : (
          <div>
            {activeTab === 'created' ? (
              // 我创建的活动
              <div>
                {myActivities.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-gray-400 text-6xl mb-4">📝</div>
                    <p className="text-gray-600 text-lg">您还没有创建任何活动</p>
                    <Link
                      to="/activity/create"
                      className="inline-block mt-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors no-underline"
                    >
                      创建第一个活动
                    </Link>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            活动信息
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            状态
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            参与人数
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            开始时间
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            操作
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {myActivities.map((activity) => (
                          <tr key={activity.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4">
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {activity.title}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {activity.location}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(activity.status)}`}>
                                {getStatusText(activity.status)}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-900">
                              {activity.currentParticipants}/{activity.maxParticipants}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-900">
                              {formatDate(activity.startTime)}
                            </td>
                            <td className="px-6 py-4 text-sm font-medium space-x-2">
                              <Link
                                to={`/activity/${activity.id}`}
                                className="text-blue-600 hover:text-blue-900 no-underline"
                              >
                                查看
                              </Link>
                              {activity.status !== 'completed' && activity.status !== 'cancelled' && (
                                <Link
                                  to={`/activity/edit/${activity.id}`}
                                  className="text-green-600 hover:text-green-900 no-underline"
                                >
                                  编辑
                                </Link>
                              )}
                              {activity.status === 'draft' && (
                                <button
                                  onClick={() => handlePublishActivity(activity.id)}
                                  className="text-purple-600 hover:text-purple-900"
                                >
                                  发布
                                </button>
                              )}
                              {activity.currentParticipants === 0 && (
                                <button
                                  onClick={() => handleDeleteActivity(activity.id)}
                                  className="text-red-600 hover:text-red-900"
                                >
                                  删除
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            ) : (
              // 我参与的活动
              <div>
                {joinedActivities.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-gray-400 text-6xl mb-4">🏃‍♂️</div>
                    <p className="text-gray-600 text-lg">您还没有参与任何活动</p>
                    <Link
                      to="/square"
                      className="inline-block mt-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors no-underline"
                    >
                      去活动广场看看
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4 p-6">
                    {joinedActivities.map((registration) => (
                      <div key={registration.id} className="border rounded-lg p-4 hover:bg-gray-50">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                              {registration.activity?.title || '活动标题'}
                            </h3>
                            <div className="text-sm text-gray-600 space-y-1">
                              <div>📍 {registration.activity?.location}</div>
                              <div>⏰ {formatDate(registration.activity?.startTime)}</div>
                              <div>💰 ¥{registration.activity?.fee || 0}</div>
                            </div>
                          </div>
                          <div className="text-right space-y-2">
                            <div>
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(registration.status)}`}>
                                {getStatusText(registration.status)}
                              </span>
                            </div>
                            <div>
                              <Link
                                to={`/activity/${registration.activityId}`}
                                className="text-blue-600 hover:text-blue-900 text-sm no-underline"
                              >
                                查看详情
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default ManagePage;