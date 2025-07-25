const API_BASE = '/api/user';

// 登录
export async function loginApi({ username, password }) {
  const res = await fetch(`${API_BASE}/login`, { 
    // 发送POST请求，包含用户名和密码，服务器验证后返回token
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
    credentials: 'include', // 允许发送cookie
  });
  let data;
  try {
    data = await res.json();
  } catch {
    throw new Error('服务器响应格式错误');
  }
  console.log('登录响应数据:', data);
  // 如果响应状态码不是2xx，抛出错误
  if (!res.ok) throw new Error(`登录失败: ${res.status}`);
  // 支持多种后端响应格式提取token
  const token = data.token || (data.data && data.data.token);
  if (!token) throw new Error('登录响应中未包含token，请检查后端配置');
  return { ...data, token };
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