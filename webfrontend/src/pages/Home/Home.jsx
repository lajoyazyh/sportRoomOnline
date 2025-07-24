// Home.jsx
// 顶部导航栏页面。后续可通过React Router等方式实现页面跳转，当前为本地状态切换。
// 预留：可在useEffect中请求后端接口获取用户信息、活动数据等。
// TODO: 集成后端API、完善各页面内容。
import { useState } from 'react';
import ProfilePage from '../Profile/ProfilePage';

const navs = [
  { key: 'home', label: '首页' },
  { key: 'square', label: '活动广场' },
  { key: 'manage', label: '活动管理' },
  { key: 'profile', label: '个人信息' },
];

function Home({ onLogout }) {
  const [active, setActive] = useState('home');

  // 预留各页面内容
  const renderContent = () => {
    switch (active) {
      case 'home':
        return <div>欢迎来到首页！</div>;
      case 'square':
        return <div>活动广场（待实现）</div>;
      case 'manage':
        return <div>活动管理（待实现）</div>;
      case 'profile':
        return <ProfilePage />;
      default:
        return null;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    if (onLogout) {
      onLogout();
    }
    window.location.reload();
  };

  return (
    <div>
      <nav style={{
        display: 'flex',
        alignItems: 'center',
        background: '#222',
        color: '#fff',
        padding: '0.5rem 2rem',
        marginBottom: 24,
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        zIndex: 1000,
        boxSizing: 'border-box',
      }}>
        <div style={{ fontWeight: 'bold', fontSize: 20, marginRight: 32 }}>LOGO</div>
        {navs.map((item) => (
          <button
            key={item.key}
            onClick={() => setActive(item.key)}
            style={{
              background: active === item.key ? '#646cff' : 'transparent',
              color: active === item.key ? '#fff' : '#ccc',
              border: 'none',
              padding: '8px 18px',
              marginRight: 8,
              borderRadius: 6,
              fontWeight: 500,
              cursor: 'pointer',
              fontSize: 16,
              transition: 'background 0.2s',
            }}
          >
            {item.label}
          </button>
        ))}
        <button
          onClick={handleLogout}
          style={{
            marginLeft: 'auto',
            marginRight: '2rem',
            background: '#ff4d4f',
            color: '#fff',
            border: 'none',
            padding: '8px 18px',
            borderRadius: 6,
            fontWeight: 500,
            cursor: 'pointer',
            fontSize: 16,
            transition: 'background 0.2s',
          }}
        >
          退出登录
        </button>
      </nav>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: 24, paddingTop: 80 }}>
        {renderContent()}
      </div>
    </div>
  );
}

export default Home;