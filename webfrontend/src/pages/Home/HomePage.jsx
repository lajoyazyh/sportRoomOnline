import { Outlet, Link } from 'react-router-dom';
import { useState } from 'react';
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div>
      {/* 桌面端导航 */}
      <nav className="bg-gray-800 text-white py-3 px-4 sm:px-8 mb-6 fixed top-0 left-0 w-full z-[1000] box-border">
        <div className="flex items-center justify-between">
          {/* 左侧：Logo + 导航链接 */}
          <div className="flex items-center">
            {/* Logo */}
            <div className="font-bold text-xl mr-8">LOGO</div>
            
            {/* 桌面端导航链接 */}
            <div className="hidden md:flex items-center space-x-2">
              {navs.map((item) => (
                <Link
                  key={item.key}
                  to={item.path}
                  className="bg-transparent text-gray-300 no-underline border-none py-2 px-4 rounded-md font-medium cursor-pointer text-base transition-colors duration-200 hover:bg-[#646cff] hover:text-white"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {/* 右侧：退出按钮 + 移动端菜单按钮 */}
          <div className="flex items-center space-x-4">
            {/* 桌面端退出按钮 */}
            <button
              onClick={onLogout}
              className="hidden md:block bg-red-500 text-white border-none py-2 px-4 rounded-md font-medium cursor-pointer text-base transition-colors duration-200 hover:bg-red-600"
            >
              退出登录
            </button>

            {/* 移动端汉堡菜单按钮 */}
            <button
              className="md:hidden flex items-center justify-center w-10 h-10 text-white hover:bg-gray-700 rounded-md transition-colors duration-200"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* 移动端下拉菜单 */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-700">
            <div className="flex flex-col space-y-2 pt-4">
              {navs.map((item) => (
                <Link
                  key={item.key}
                  to={item.path}
                  className="text-gray-300 no-underline py-3 px-4 rounded-md font-medium text-base transition-colors duration-200 hover:bg-gray-700 hover:text-white"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <button
                onClick={() => {
                  onLogout();
                  setMobileMenuOpen(false);
                }}
                className="text-left bg-red-500 text-white border-none py-3 px-4 rounded-md font-medium text-base transition-colors duration-200 hover:bg-red-600 mt-2"
              >
                退出登录
              </button>
            </div>
          </div>
        )}
      </nav>
      
      {/* 主内容区域 */}
      <div className="max-w-[900px] mx-auto p-4 sm:p-6 pt-20 sm:pt-24">
        <Outlet />
      </div>
    </div>
  );
}

export default HomePage;