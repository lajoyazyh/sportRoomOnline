const API_BASE = 'http://localhost:7001/api/activity';

// 获取活动列表
export async function getActivityListApi(params = {}) {
  const queryString = new URLSearchParams(params).toString();
  const url = queryString ? `${API_BASE}/list?${queryString}` : `${API_BASE}/list`;
  
  const res = await fetch(url, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  });
  
  if (!res.ok) throw new Error(`获取活动列表失败: ${res.status}`);
  return await res.json();
}

// 获取活动详情
export async function getActivityDetailApi(id) {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  });
  
  if (!res.ok) throw new Error(`获取活动详情失败: ${res.status}`);
  return await res.json();
}

// 创建活动
export async function createActivityApi(activityData) {
  const token = localStorage.getItem('token');
  
  const res = await fetch(`${API_BASE}/create`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(activityData),
    credentials: 'include',
  });
  
  if (!res.ok) throw new Error(`创建活动失败: ${res.status}`);
  return await res.json();
}

// 更新活动
export async function updateActivityApi(id, updateData) {
  const token = localStorage.getItem('token');
  
  const res = await fetch(`${API_BASE}/${id}`, {
    method: 'PUT',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(updateData),
    credentials: 'include',
  });
  
  if (!res.ok) throw new Error(`更新活动失败: ${res.status}`);
  return await res.json();
}

// 删除活动
export async function deleteActivityApi(id) {
  const token = localStorage.getItem('token');
  
  const res = await fetch(`${API_BASE}/${id}`, {
    method: 'DELETE',
    headers: { 
      'Authorization': `Bearer ${token}`,
    },
    credentials: 'include',
  });
  
  if (!res.ok) throw new Error(`删除活动失败: ${res.status}`);
  return await res.json();
}

// 获取我的活动
export async function getMyActivitiesApi(params = {}) {
  const token = localStorage.getItem('token');
  const queryString = new URLSearchParams(params).toString();
  const url = queryString ? `${API_BASE}/my/activities?${queryString}` : `${API_BASE}/my/activities`;
  
  const res = await fetch(url, {
    method: 'GET',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    credentials: 'include',
  });
  
  if (!res.ok) throw new Error(`获取我的活动失败: ${res.status}`);
  return await res.json();
}

// 上传活动图片
export async function uploadActivityImagesApi(id, files) {
  const token = localStorage.getItem('token');
  const formData = new FormData();
  
  files.forEach((file, index) => {
    formData.append(`file${index}`, file);
  });
  
  const res = await fetch(`${API_BASE}/${id}/upload-images`, {
    method: 'POST',
    headers: { 
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
    credentials: 'include',
  });
  
  if (!res.ok) throw new Error(`上传活动图片失败: ${res.status}`);
  return await res.json();
}

// 搜索活动
export async function searchActivitiesApi(params = {}) {
  const queryString = new URLSearchParams(params).toString();
  const url = queryString ? `${API_BASE}/search?${queryString}` : `${API_BASE}/search`;
  
  const res = await fetch(url, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  });
  
  if (!res.ok) throw new Error(`搜索活动失败: ${res.status}`);
  return await res.json();
}
