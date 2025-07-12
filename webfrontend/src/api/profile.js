const API_BASE = '/api';

// 获取个人信息
export async function getProfileApi() {
  const res = await fetch(`${API_BASE}/profile`, { credentials: 'include' });
  if (!res.ok) throw new Error('获取个人信息失败');
  return res.json();
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