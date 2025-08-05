import { Outlet, Link } from 'react-router-dom';
import ProfilePage from '../Profile/ProfilePage';

const navs = [
  { key: 'home', label: '首页', path: '/home' },
  { key: 'square', label: '活动广场', path: '/home/square' },
  { key: 'manage', label: '活动管理', path: '/home/manage' },
  { key: 'profile', label: '个人信息', path: '/home/profile' },
  { key: 'orders', label: '我的订单', path: '/home/orders' },
  { key: 'comments', label: '我的评价', path: '/home/comments' },
];

function HomePage({ onLogout }) {
  return (
    <div>
      <nav className="flex items-center bg-gray-800 text-white py-2 px-8 mb-6 fixed top-0 left-0 w-full z-[1000] box-border">
        <div className="font-bold text-xl mr-8">LOGO</div>
        {navs.map((item) => (
          <Link
            key={item.key}
            to={item.path}
            className="bg-transparent text-gray-300 no-underline border-none py-2 px-[18px] mr-2 rounded-md font-medium cursor-pointer text-base transition-colors duration-200 hover:bg-[#646cff] hover:text-white"
          >
            {item.label}
          </Link>
        ))}
        <button
          onClick={onLogout}
          className="ml-auto mr-8 bg-red-500 text-white border-none py-2 px-[18px] rounded-md font-medium cursor-pointer text-base transition-colors duration-200 hover:bg-red-600"
        >
          退出登录
        </button>
      </nav>
      <div className="max-w-[900px] mx-auto p-6 pt-20">
        <Outlet />
      </div>
    </div>
  );
}

export default HomePage;