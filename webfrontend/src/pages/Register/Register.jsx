import { useState } from 'react';
import { registerApi } from '../../api/auth';

function Register({ setSuccess }) {
  const [form, setForm] = useState({ username: '', password: '', confirm: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!form.username || !form.password || !form.confirm) {
      setError('请填写所有字段');
      return;
    }
    if (form.password !== form.confirm) {
      setError('两次输入的密码不一致');
      return;
    }
    // ===================== 后续对接后端API：注册 =====================
    try {
      await registerApi({ username: form.username, password: form.password });
      setSuccess('注册成功');
    } catch (err) {
      setError(err.message || '注册失败');
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
      <div className="login-register-field">
        <input
          name="confirm"
          type="password"
          placeholder="确认密码"
          value={form.confirm}
          onChange={handleChange}
        />
      </div>
      {error && <div style={{ color: 'red', marginBottom: 8 }}>{error}</div>}
      <button type="submit">
        注册
      </button>
    </form>
  );
}

export default Register; 