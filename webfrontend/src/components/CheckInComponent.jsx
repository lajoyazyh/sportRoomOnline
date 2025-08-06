import { useState, useEffect, useCallback } from 'react';
import * as checkInAPI from '../api/checkIn';

export default function CheckInComponent({ activityId }) {
  const [checkInStatus, setCheckInStatus] = useState(null);
  const [checkInCode, setCheckInCode] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const loadCheckInStatus = useCallback(async () => {
    try {
      setLoading(true);
      const response = await checkInAPI.getCheckInStatus(activityId);
      
      if (response.success) {
        setCheckInStatus(response.data);
      } else {
        setError(response.message || '获取签到状态失败');
      }
    } catch (error) {
      console.error('获取签到状态失败:', error);
      setError('网络错误，请稍后重试');
    } finally {
      setLoading(false);
    }
  }, [activityId]);

  useEffect(() => {
    loadCheckInStatus();
  }, [loadCheckInStatus]);

  const handleCheckIn = async (e) => {
    e.preventDefault();
    
    if (!checkInCode.trim()) {
      setError('请输入签到码');
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      setSuccess('');
      
      const response = await checkInAPI.checkIn(activityId, checkInCode.trim().toUpperCase());
      
      if (response.success) {
        setSuccess('签到成功！');
        setCheckInCode('');
        // 重新加载签到状态
        await loadCheckInStatus();
      } else {
        setError(response.message || '签到失败');
      }
    } catch (error) {
      console.error('签到失败:', error);
      setError('网络错误，请稍后重试');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">加载签到状态...</span>
        </div>
      </div>
    );
  }

  // 如果用户已经签到
  if (checkInStatus?.hasCheckedIn) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-6">
        <div className="text-center">
          <div className="text-green-600 text-2xl mb-2">✓</div>
          <h3 className="text-lg font-semibold text-green-800 mb-2">已签到</h3>
          <p className="text-green-700">
            签到时间: {new Date(checkInStatus.checkInTime).toLocaleString('zh-CN')}
          </p>
        </div>
      </div>
    );
  }

  // 如果用户不能签到
  if (!checkInStatus?.canCheckIn) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <div className="text-center">
          <div className="text-gray-400 text-2xl mb-2">📝</div>
          <h3 className="text-lg font-semibold text-gray-600 mb-2">暂不可签到</h3>
          <p className="text-gray-500">{checkInStatus?.reason}</p>
        </div>
      </div>
    );
  }

  // 显示签到表单
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
      <div className="text-center mb-4">
        <div className="text-blue-600 text-2xl mb-2">📋</div>
        <h3 className="text-lg font-semibold text-blue-800 mb-2">活动签到</h3>
        <p className="text-blue-700 text-sm">请向活动组织者获取签到码</p>
      </div>

      <form onSubmit={handleCheckIn} className="space-y-4">
        <div>
          <label htmlFor="checkInCode" className="block text-sm font-medium text-gray-700 mb-2">
            签到码
          </label>
          <input
            type="text"
            id="checkInCode"
            value={checkInCode}
            onChange={(e) => setCheckInCode(e.target.value.toUpperCase())}
            placeholder="请输入6位签到码"
            maxLength={6}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-lg font-mono tracking-wider"
            disabled={submitting}
          />
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 rounded-md p-3">
            <p className="text-green-600 text-sm">{success}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={submitting || !checkInCode.trim()}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {submitting ? '签到中...' : '确认签到'}
        </button>
      </form>
    </div>
  );
}
