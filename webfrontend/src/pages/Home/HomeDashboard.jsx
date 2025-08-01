// HomeDashboard.jsx
// 首页仪表盘组件，展示用户活动概览和推荐内容

import { Link } from 'react-router-dom';

function HomeDashboard() {
  return (
    <div className="p-5">
      <h2 className="text-2xl font-bold text-gray-800 mb-5">首页仪表盘</h2>
      
      {/* 快速导航卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Link
          to="/home/square"
          className="bg-blue-50 border border-blue-200 rounded-lg p-6 hover:bg-blue-100 transition-colors text-center block no-underline"
        >
          <div className="text-4xl mb-3">🏃‍♂️</div>
          <h3 className="text-lg font-semibold text-blue-800 mb-2">活动广场</h3>
          <p className="text-blue-600 text-sm">浏览所有体育活动</p>
        </Link>
        
        <Link
          to="/activity/create"
          className="bg-green-50 border border-green-200 rounded-lg p-6 hover:bg-green-100 transition-colors text-center block no-underline"
        >
          <div className="text-4xl mb-3">➕</div>
          <h3 className="text-lg font-semibold text-green-800 mb-2">创建活动</h3>
          <p className="text-green-600 text-sm">发布新的体育活动</p>
        </Link>
        
        <Link
          to="/home/profile"
          className="bg-purple-50 border border-purple-200 rounded-lg p-6 hover:bg-purple-100 transition-colors text-center block no-underline"
        >
          <div className="text-4xl mb-3">👤</div>
          <h3 className="text-lg font-semibold text-purple-800 mb-2">个人中心</h3>
          <p className="text-purple-600 text-sm">管理个人信息</p>
        </Link>
      </div>
      
      <div className="mt-5">
        <p className="text-gray-600 text-lg">欢迎来到体育活动室！开始您的运动之旅。</p>
        <div className="bg-gray-100 p-4 rounded-lg mt-4">
          <h3 className="text-xl font-semibold text-gray-700 mb-3">快速开始</h3>
          <ul className="pl-5 list-disc text-gray-600">
            <li className="mb-1">
              <Link to="/home/profile" className="text-blue-600 hover:text-blue-800">
                完善个人资料设置
              </Link>
            </li>
            <li className="mb-1">
              <Link to="/home/square" className="text-blue-600 hover:text-blue-800">
                浏览活动广场
              </Link>
            </li>
            <li className="mb-1">
              <Link to="/activity/create" className="text-blue-600 hover:text-blue-800">
                创建第一个活动
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default HomeDashboard;