import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerApi } from '../../api/auth';
import '../../App.css';
import '../Login/login-register.css';

function RegisterPage() {
  const [form, setForm] = useState({ username: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // 表单验证
    if (!form.username || !form.password || !form.confirm) {
      setError('请填写所有字段');
      return;
    }
    if (form.password !== form.confirm) {
      setError('两次输入的密码不一致');
      return;
    }
    if (form.password.length < 6) {
      setError('密码长度不能少于6位');
      return;
    }

    try {
      setLoading(true);
      await registerApi({ username: form.username, password: form.password });
      setSuccess('注册成功！即将跳转到登录页...');
      // 注册成功后跳转到登录页
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setError(err.message || '注册失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-bg" style={{ minHeight: '100vh', width: '100vw', position: 'fixed', left: 0, top: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="card" style={{ maxWidth: 520, width: '100%', padding: '40px', boxSizing: 'border-box', background: 'rgba(255,255,255,0.1)', borderRadius: 18, boxShadow: '0 8px 32px 0 rgba(207, 207, 211, 0.6)', backdropFilter: 'blur(16px) saturate(180%)', WebkitBackdropFilter: 'blur(16px) saturate(180%)', border: '1.5px solid #e0e7ef' }}
      >
        <h2>注册</h2>
        <form className="login-register-form" onSubmit={handleSubmit}>
          <div className="login-register-field">
            <input
              name="username"
              type="text"
              placeholder="用户名"
              value={form.username}
              onChange={handleChange}
              disabled={loading}
            />
          </div>
          <div className="login-register-field">
            <input
              name="password"
              type="password"
              placeholder="密码"
              value={form.password}
              onChange={handleChange}
              disabled={loading}
            />
          </div>
          <div className="login-register-field">
            <input
              name="confirm"
              type="password"
              placeholder="确认密码"
              value={form.confirm}
              onChange={handleChange}
              disabled={loading}
            />
          </div>
          {error && <div style={{ color: 'red', marginBottom: 8 }}>{error}</div>}
          {success && <div style={{ color: 'green', marginBottom: 8 }}>{success}</div>}
          <button type="submit" disabled={loading}>
            {loading ? '注册中...' : '注册'}
          </button>
        </form>
        <div style={{ marginTop: 16, textAlign: 'center' }}>
          <span>已有账号？ </span>
          <Link to="/login" style={{ color: '#646cff', textDecoration: 'none' }}>去登录</Link>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;