const API_BASE = '/api';

// 登录
export async function loginApi({ username, password }) {
  const res = await fetch(`${API_BASE}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
    credentials: 'include',
  });
  let data;
  try {
    data = await res.json();
  } catch {
    throw new Error('服务器响应格式错误');
  }
  if (!res.ok || !data.success) throw new Error(data.message || '登录失败');
  return data;
}

// 注册
export async function registerApi({ username, password }) {
  const res = await fetch(`${API_BASE}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
    credentials: 'include',
  });
  let data;
  try {
    data = await res.json();
  } catch {
    throw new Error('服务器响应格式错误');
  }
  if (!res.ok || !data.success) throw new Error(data.message || '注册失败');
  return data;
} 