import { Outlet, Link } from 'react-router-dom';
import ProfilePage from '../Profile/ProfilePage';

const navs = [
  { key: 'home', label: '首页', path: '/home' },
  { key: 'square', label: '活动广场', path: '/home/square' },
  { key: 'manage', label: '活动管理', path: '/home/manage' },
  { key: 'profile', label: '个人信息', path: '/home/profile' },
];

function HomePage({ onLogout }) {
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
          <Link
            key={item.key}
            to={item.path}
            style={{
              background: 'transparent',
              color: '#ccc',
              textDecoration: 'none',
              border: 'none',
              padding: '8px 18px',
              marginRight: 8,
              borderRadius: 6,
              fontWeight: 500,
              cursor: 'pointer',
              fontSize: 16,
              transition: 'background 0.2s',
              '&.active': {
                background: '#646cff',
                color: '#fff'
              }
            }}
          >
            {item.label}
          </Link>
        ))}
        <button
          onClick={onLogout}
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
        <Outlet />
      </div>
    </div>
  );
}

export default HomePage;