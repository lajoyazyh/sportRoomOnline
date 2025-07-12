import { useState } from 'react';
import Login from '../Login/Login';
import Register from '../Register/Register';
import '../../App.css';
import './login-register.css';
import Home from '../Home/Home';

function LoginRegister() {
  const [mode, setMode] = useState('login'); // 'login' or 'register'
  const [success, setSuccess] = useState('');
  const [isHome, setIsHome] = useState(false); // 新增：是否进入首页

  // 登录成功后跳转到首页
  const handleLoginSuccess = (msg) => {
    setSuccess(msg || "登陆成功");
    if (msg === '登录成功') { // 只有后端返回成功时才跳转
      setTimeout(() => setIsHome(true), 500);
    }
  };

  // 注册成功后切换到登录
  const handleRegisterSuccess = () => {
    setSuccess('注册成功（演示）');
    setTimeout(() => {
      setMode('login');
      setSuccess('');
    }, 800); // 0.8秒后切换
  };

  if (isHome) {
    return <Home />;
  }

  // 如需插入背景图片，直接在.login-bg设置background-image即可
  return (
    <div className="login-bg" style={{ minHeight: '100vh', width: '100vw', position: 'fixed', left: 0, top: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="card" style={{
        maxWidth: 520,
        width: '100%',
        padding: '40px 40px 32px 40px',
        boxSizing: 'border-box',
        background: 'rgba(255,255,255,0.1)',
        borderRadius: 18,
        boxShadow: '0 8px 32px 0 rgba(207, 207, 211, 0.6)',
        backdropFilter: 'blur(16px) saturate(180%)',
        WebkitBackdropFilter: 'blur(16px) saturate(180%)',
        border: '1.5px solid #e0e7ef',
      }}>
        <h2>{mode === 'login' ? '登录' : '注册'}</h2>
        {mode === 'login' ? (
          <Login setSuccess={handleLoginSuccess} />
        ) : (
          <Register setSuccess={handleRegisterSuccess} />
        )}
        {success && <div style={{ color: 'green', marginBottom: 8 }}>{success}</div>}
        <div style={{ marginTop: 16 }}>
          {mode === 'login' ? (
            <span>
              没有账号？{' '}
              <a href="#" onClick={() => { setMode('register'); setSuccess(''); }}>
                去注册
              </a>
            </span>
          ) : (
            <span>
              已有账号？{' '}
              <a href="#" onClick={() => { setMode('login'); setSuccess(''); }}>
                去登录
              </a>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default LoginRegister; 