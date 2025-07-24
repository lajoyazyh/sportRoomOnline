import { useState } from 'react';
import { loginApi } from '../../api/auth';

function Login({ setSuccess: onSuccess }) {
  const [form, setForm] = useState({ username: '', password: '' });
  const [success, setSuccess] = useState('');
  const [successState, setSuccessState] = useState(null); // null/true/false

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess('');
    setSuccessState(null);
    if (!form.username || !form.password) {
      setSuccess('请填写所有字段');
      setSuccessState(false);
      return;
    }
    // ===================== 后续对接后端API：登录 =====================
    try {
      const data = await loginApi({ username: form.username, password: form.password });
      console.log('loginApi返回的数据:', data);
      // 保存token到本地存储
      localStorage.setItem('token', data.token);
      console.log('登录成功，保存的token:', data.token);
      setSuccess(data.message || '登录成功');
      setSuccessState(true);
      if (onSuccess) onSuccess(data.message || '登录成功');
    } catch (err) {
      setSuccess(err.message || '登录失败');
      setSuccessState(false);
    }
  };

  return (
    <form className="login-register-form" onSubmit={handleSubmit}>
      <div className="login-register-field">
        <input
          name="username"
          type="text"
          placeholder="用户名"
          value={form.username}
          onChange={handleChange}
        />
      </div>
      <div className="login-register-field">
        <input
          name="password"
          type="password"
          placeholder="密码"
          value={form.password}
          onChange={handleChange}
        />
      </div>
      
      <button type="submit">
        登录
      </button>
      {success && (
        <div style={{ color: successState === true ? 'green' : 'red', marginBottom: 8 }}>{success}</div>
      )}
    </form>
  );
}

export default Login;