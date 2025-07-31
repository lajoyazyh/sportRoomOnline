const API_BASE = 'http://localhost:7001/api/user';

// 获取个人信息
// 添加signal参数以支持请求取消
export async function getProfileApi({ signal } = {}) {
  const token = localStorage.getItem('token');
  console.log('发送的token:', token);
  const res = await fetch(`${API_BASE}/profile`, {
    headers: token ? { 'Authorization': `Bearer ${token}` } : {},
    credentials: 'include',
    signal // 将signal传递给fetch请求
  });
  console.log('Profile API响应状态:', res.status);
  if (!res.ok) {
    const error = await res.text().catch(() => '未知错误');
    console.error('获取个人信息失败:', error);
    throw new Error(`获取个人信息失败: ${res.status} ${error}`);
  }
  const data = await res.json();
  console.log('获取到的用户信息:', data);
  // 无论HTTP状态码如何，只要success为false就抛出错误
  if (!data.success) {
    throw new Error(data.message || '获取个人信息失败');
  }
  return data;
}

// 更新个人信息
export async function updateProfileApi(profile) {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_BASE}/profile`, {
    method: 'PUT',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(profile),
  });
  if (!res.ok) throw new Error('保存个人信息失败');
  const data = await res.json();
  if (!data.success) {
    throw new Error(data.message || '保存个人信息失败');
  }
  return data;
}

// 上传头像
export async function uploadAvatarApi(file) {
  const formData = new FormData();
  formData.append('avatar', file);
  
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_BASE}/upload-avatar`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: formData,
  });
  
  if (!res.ok) {
    throw new Error('头像上传失败');
  }
  
  const data = await res.json();
  if (!data.success) {
    throw new Error(data.message || '头像上传失败');
  }
  
  return data;
}

// 上传照片
export async function uploadPhotoApi(file) {
  const formData = new FormData();
  formData.append('photo', file);
  const res = await fetch(`${API_BASE}/profile/photo`, {
    method: 'POST',
    credentials: 'include',
    body: formData,
  });
  if (!res.ok) throw new Error('上传照片失败');
  return res.json();
}

// 批量上传照片到照片墙
export async function uploadPhotosApi(files) {
  const formData = new FormData();
  files.forEach(file => {
    formData.append('photos', file);
  });
  
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_BASE}/upload-photos`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: formData,
  });
  
  if (!res.ok) {
    throw new Error('照片上传失败');
  }
  
  const data = await res.json();
  if (!data.success) {
    throw new Error(data.message || '照片上传失败');
  }
  
  return data;
}

// 删除照片墙中的照片
export async function deletePhotoApi(photoIndex) {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_BASE}/delete-photo`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ photoIndex }),
  });
  
  if (!res.ok) {
    throw new Error('删除照片失败');
  }
  
  const data = await res.json();
  if (!data.success) {
    throw new Error(data.message || '删除照片失败');
  }
  
  return data;
}