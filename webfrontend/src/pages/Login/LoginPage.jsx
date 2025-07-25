import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginApi } from '../../api/auth';
import '../../App.css';
import './login-register.css';

function LoginPage({ onLoginSuccess }) {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.username || !form.password) {
      setError('请填写所有字段');
      return;
    }

    try {
      setLoading(true);
      const response = await loginApi({ username: form.username, password: form.password });
      localStorage.setItem('token', response.token);
      onLoginSuccess(response.data || response.user);
      navigate('/home');
    } catch (err) {
      setError(err.message || '登录失败，请检查用户名和密码');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-bg" style={{ minHeight: '100vh', width: '100vw', position: 'fixed', left: 0, top: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="card" style={{ maxWidth: 520, width: '100%', padding: '40px', boxSizing: 'border-box', background: 'rgba(255,255,255,0.1)', borderRadius: 18, boxShadow: '0 8px 32px 0 rgba(207, 207, 211, 0.6)', backdropFilter: 'blur(16px) saturate(180%)', WebkitBackdropFilter: 'blur(16px) saturate(180%)', border: '1.5px solid #e0e7ef' }}
      >
        <h2>登录</h2>
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
          {error && <div style={{ color: 'red', marginBottom: 8 }}>{error}</div>}
          <button type="submit" disabled={loading}>
            {loading ? '登录中...' : '登录'}
          </button>
        </form>
        <div style={{ marginTop: 16, textAlign: 'center' }}>
          <span>没有账号？ </span>
          <Link to="/register" style={{ color: '#646cff', textDecoration: 'none' }}>去注册</Link>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;