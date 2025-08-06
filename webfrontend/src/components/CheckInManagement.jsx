import { useState, useEffect, useCallback } from 'react';
import * as checkInAPI from '../api/checkIn';

export default function CheckInManagement({ activityId, isCreator = false }) {
  const [checkInCode, setCheckInCode] = useState('');
  const [isEnabled, setIsEnabled] = useState(false);
  const [checkInList, setCheckInList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const loadData = useCallback(async () => {
    if (!isCreator) return;
    
    try {
      setLoading(true);
      const listResponse = await checkInAPI.getActivityCheckIns(activityId);

      if (listResponse.success) {
        const { activity, checkIns } = listResponse.data;
        
        // 从活动信息中获取签到码状态
        if (activity.checkInEnabled && activity.checkInCode) {
          setCheckInCode(activity.checkInCode);
          setIsEnabled(true);
        } else {
          setCheckInCode('');
          setIsEnabled(false);
        }
        
        // 设置签到列表，添加userName字段
        const formattedCheckIns = checkIns.map(checkIn => ({
          ...checkIn,
          userId: checkIn.user.userid,
          userName: checkIn.user.nickname || checkIn.user.username,
          checkInTime: checkIn.checkInTime
        }));
        setCheckInList(formattedCheckIns);
      }
    } catch (error) {
      console.error('加载签到数据失败:', error);
      setError('加载数据失败，请刷新重试');
    } finally {
      setLoading(false);
    }
  }, [activityId, isCreator]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleGenerateCode = async () => {
    try {
      setGenerating(true);
      setError('');
      setSuccess('');
      
      const response = await checkInAPI.createCheckInCode(activityId);
      
      if (response.success) {
        setSuccess('签到码生成成功！');
        // 重新加载数据以获取最新的签到码状态
        await loadData();
      } else {
        setError(response.message || '生成签到码失败');
      }
    } catch (error) {
      console.error('生成签到码失败:', error);
      setError('网络错误，请稍后重试');
    } finally {
      setGenerating(false);
    }
  };

  const handleDisableCheckIn = async () => {
    try {
      setGenerating(true);
      setError('');
      setSuccess('');
      
      const response = await checkInAPI.disableCheckIn(activityId);
      
      if (response.success) {
        setSuccess('已停止签到');
        // 重新加载数据以获取最新状态
        await loadData();
      } else {
        setError(response.message || '停止签到失败');
      }
    } catch (error) {
      console.error('停止签到失败:', error);
      setError('网络错误，请稍后重试');
    } finally {
      setGenerating(false);
    }
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setSuccess('签到码已复制到剪贴板');
      setTimeout(() => setSuccess(''), 2000);
    } catch {
      // 如果clipboard API不可用，使用fallback
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setSuccess('签到码已复制到剪贴板');
      setTimeout(() => setSuccess(''), 2000);
    }
  };

  if (!isCreator) {
    return null;
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">加载签到管理...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="p-6 border-b">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">签到管理</h2>
        
        {/* 签到码生成区域 */}
        <div className="space-y-4">
          {isEnabled && checkInCode ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-medium text-green-800">当前签到码</h3>
                <button
                  onClick={handleDisableCheckIn}
                  disabled={generating}
                  className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
                >
                  {generating ? '停止中...' : '停止签到'}
                </button>
              </div>
              <div className="flex items-center space-x-3">
                <div className="bg-white border-2 border-green-300 rounded-lg px-4 py-3 font-mono text-2xl font-bold text-green-700 tracking-wider">
                  {checkInCode}
                </div>
                <button
                  onClick={() => copyToClipboard(checkInCode)}
                  className="px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                >
                  复制
                </button>
              </div>
              <p className="text-green-600 text-sm mt-2">
                学员可以使用此签到码进行签到
              </p>
            </div>
          ) : (
            <div className="text-center py-6">
              <div className="text-gray-400 text-4xl mb-3">📝</div>
              <h3 className="text-lg font-medium text-gray-600 mb-2">暂无签到码</h3>
              <p className="text-gray-500 mb-4">生成签到码以开始签到</p>
              <button
                onClick={handleGenerateCode}
                disabled={generating}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {generating ? '生成中...' : '生成签到码'}
              </button>
            </div>
          )}
        </div>

        {/* 消息提示 */}
        {error && (
          <div className="mt-4 bg-red-50 border border-red-200 rounded-md p-3">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {success && (
          <div className="mt-4 bg-green-50 border border-green-200 rounded-md p-3">
            <p className="text-green-600 text-sm">{success}</p>
          </div>
        )}
      </div>

      {/* 签到记录列表 */}
      <div className="p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          签到记录 ({checkInList.length})
        </h3>
        
        {checkInList.length > 0 ? (
          <div className="space-y-3">
            {checkInList.map((checkIn) => (
              <div
                key={`${checkIn.userId}-${checkIn.checkInTime}`}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                    {checkIn.userName?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{checkIn.userName || '未知用户'}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(checkIn.checkInTime).toLocaleString('zh-CN')}
                    </p>
                  </div>
                </div>
                <div className="text-green-600 text-sm font-medium">
                  ✓ 已签到
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="text-gray-400 text-3xl mb-2">📊</div>
            <p className="text-gray-500">暂无签到记录</p>
          </div>
        )}
      </div>
    </div>
  );
}
