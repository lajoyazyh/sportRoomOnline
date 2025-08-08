const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:7001';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

// 生成签到码（活动创建者）
export const createCheckInCode = async (activityId) => {
  const response = await fetch(`${API_BASE_URL}/api/checkin/${activityId}/code`, {
    method: 'POST',
    headers: getAuthHeaders(),
  });
  return await response.json();
};

// 用户签到
export const checkIn = async (activityId, checkInCode) => {
  const response = await fetch(`${API_BASE_URL}/api/checkin/${activityId}`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ checkInCode }),
  });
  return await response.json();
};

// 获取签到状态
export const getCheckInStatus = async (activityId) => {
  const response = await fetch(`${API_BASE_URL}/api/checkin/${activityId}/status`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  return await response.json();
};

// 获取活动签到列表（活动创建者）
export const getActivityCheckIns = async (activityId) => {
  const response = await fetch(`${API_BASE_URL}/api/checkin/${activityId}/list`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  return await response.json();
};

// 关闭签到（活动创建者）
export const disableCheckIn = async (activityId) => {
  const response = await fetch(`${API_BASE_URL}/api/checkin/${activityId}/disable`, {
    method: 'POST',
    headers: getAuthHeaders(),
  });
  return await response.json();
};
