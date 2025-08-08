// ActivityReviewPage.jsx
// 活动报名审核页面 - 活动创建者审核报名申请

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import CheckInManagement from '../../components/CheckInManagement';

const API_BASE_URL = 'http://localhost:7001';

function ActivityReviewPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [activity, setActivity] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending'); // 'pending' | 'approved' | 'rejected' | 'checkin'

  // 获取活动信息
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
        alert('活动不存在或无权限访问');
        navigate('/home/manage');
      }
    } catch (error) {
      console.error('网络错误:', error);
      alert('网络错误，请稍后重试');
      navigate('/home/manage');
    }
  }, [id, navigate]);

  // 获取报名列表
  const fetchRegistrations = useCallback(async (status) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const url = status ? 
        `${API_BASE_URL}/api/registration/activity/${id}?status=${status}` :
        `${API_BASE_URL}/api/registration/activity/${id}`;
        
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setRegistrations(data.data?.list || []);
      } else {
        console.error('获取报名列表失败');
        setRegistrations([]);
      }
    } catch (error) {
      console.error('网络错误:', error);
      setRegistrations([]);
    } finally {
      setLoading(false);
    }
  }, [id]);

  // 审核报名
  const handleReviewRegistration = async (registrationId, status, rejectReason = '') => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/registration/review/${registrationId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status,
          rejectReason,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          alert(data.message);
          // 重新获取数据
          fetchRegistrations(activeTab);
          fetchActivity(); // 更新活动信息（参与人数可能变化）
        } else {
          alert(data.message || '审核失败');
        }
      } else {
        const error = await response.json();
        alert(error.message || '审核失败');
      }
    } catch (error) {
      console.error('审核失败:', error);
      alert('网络错误，审核失败');
    }
  };

  // 确认通过
  const handleApprove = (registrationId) => {
    if (confirm('确定通过这个报名申请吗？')) {
      handleReviewRegistration(registrationId, 'approved');
    }
  };

  // 拒绝报名
  const handleReject = (registrationId) => {
    const reason = prompt('请输入拒绝原因（可选）:');
    if (reason !== null) { // 用户没有取消
      handleReviewRegistration(registrationId, 'rejected', reason);
    }
  };

  useEffect(() => {
    if (id) {
      fetchActivity();
      // 检查location.state是否有defaultTab参数
      if (location.state?.defaultTab) {
        setActiveTab(location.state.defaultTab);
      }
      // 检查URL hash，如果有#checkin则切换到签到管理标签
      else if (window.location.hash === '#checkin') {
        setActiveTab('checkin');
      }
    }
  }, [id, fetchActivity, location.state]);

  useEffect(() => {
    if (id && activeTab && activeTab !== 'checkin') {
      fetchRegistrations(activeTab);
    }
  }, [id, activeTab, fetchRegistrations]);

  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return '待审核';
      case 'approved': return '已通过';
      case 'rejected': return '已拒绝';
      case 'cancelled': return '已取消';
      default: return status;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'approved': return 'text-green-600 bg-green-100';
      case 'rejected': return 'text-red-600 bg-red-100';
      case 'cancelled': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (!activity) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* 页面头部 */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <Link
                to="/home/manage"
                className="text-blue-600 hover:text-blue-700 no-underline mb-2 inline-block"
              >
                ← 返回活动管理
              </Link>
              <h1 className="text-3xl font-bold text-gray-900">
                报名审核 - {activity.title}
              </h1>
              <p className="text-gray-600 mt-2">
                当前参与人数: {activity.currentParticipants}/{activity.maxParticipants}
              </p>
            </div>
          </div>
        </div>

        {/* 标签页切换 */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('pending')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'pending'
                    ? 'border-yellow-500 text-yellow-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                待审核
              </button>
              <button
                onClick={() => setActiveTab('approved')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'approved'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                已通过
              </button>
              <button
                onClick={() => setActiveTab('rejected')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'rejected'
                    ? 'border-red-500 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                已拒绝
              </button>
              <button
                onClick={() => setActiveTab('checkin')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'checkin'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                签到管理
              </button>
            </nav>
          </div>
        </div>

        {/* 报名列表 */}
        {activeTab === 'checkin' ? (
          <CheckInManagement 
            activityId={parseInt(id)} 
            isCreator={true}
          />
        ) : (
          <div className="bg-white rounded-lg shadow-sm">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">加载中...</p>
              </div>
            ) : registrations.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">📝</div>
                <p className="text-gray-600 text-lg">暂无{getStatusText(activeTab)}的报名</p>
              </div>
            ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      报名用户
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      联系方式
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      报名留言
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      报名时间
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      状态
                    </th>
                    {activeTab === 'pending' && (
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        操作
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {registrations.map((registration) => (
                    <tr key={registration.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {registration.user?.avatar && (
                            <img
                              className="h-10 w-10 rounded-full mr-3"
                              src={registration.user.avatar}
                              alt=""
                            />
                          )}
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {registration.user?.nickname || registration.user?.username}
                            </div>
                            <div className="text-sm text-gray-500">
                              @{registration.user?.username}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {registration.user?.phone && (
                          <div>📱 {registration.user.phone}</div>
                        )}
                        {registration.user?.email && (
                          <div>📧 {registration.user.email}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 max-w-md">
                        {registration.message || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(registration.createdAt).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(registration.status)}`}>
                          {getStatusText(registration.status)}
                        </span>
                      </td>
                      {activeTab === 'pending' && (
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                          <button
                            onClick={() => handleApprove(registration.id)}
                            className="text-green-600 hover:text-green-900"
                          >
                            通过
                          </button>
                          <button
                            onClick={() => handleReject(registration.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            拒绝
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default ActivityReviewPage;
