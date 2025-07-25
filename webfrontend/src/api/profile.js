const API_BASE = '/api/user';

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
  const res = await fetch(`${API_BASE}/profile`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(profile),
  });
  if (!res.ok) throw new Error('保存个人信息失败');
  return res.json();
}

// 上传头像
export async function uploadAvatarApi(file) {
  const formData = new FormData();
  formData.append('avatar', file);
  const res = await fetch(`${API_BASE}/profile/avatar`, {
    method: 'POST',
    credentials: 'include',
    body: formData,
  });
  if (!res.ok) throw new Error('上传头像失败');
  return res.json();
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