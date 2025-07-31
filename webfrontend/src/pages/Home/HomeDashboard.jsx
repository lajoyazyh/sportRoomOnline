// HomeDashboard.jsx
// 首页仪表盘组件，展示用户活动概览和推荐内容

function HomeDashboard() {
  return (
    <div className="p-5">
      <h2 className="text-2xl font-bold text-gray-800 mb-5">首页仪表盘</h2>
      <div className="mt-5">
        <p className="text-gray-600 text-lg">欢迎来到首页！这里将展示您的活动概览和推荐内容。</p>
        <div className="bg-gray-100 p-4 rounded-lg mt-4">
          <h3 className="text-xl font-semibold text-gray-700 mb-3">待办事项</h3>
          <ul className="pl-5 list-disc text-gray-600">
            <li className="mb-1">完成个人资料设置</li>
            <li className="mb-1">浏览活动广场</li>
            <li className="mb-1">创建第一个活动</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default HomeDashboard;