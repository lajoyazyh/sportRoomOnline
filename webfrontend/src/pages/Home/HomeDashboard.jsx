// HomeDashboard.jsx
// 首页仪表盘组件，展示用户活动概览和推荐内容

function HomeDashboard() {
  return (
    <div style={{ padding: '20px' }}>
      <h2>首页仪表盘</h2>
      <div style={{ marginTop: '20px' }}>
        <p>欢迎来到首页！这里将展示您的活动概览和推荐内容。</p>
        <div style={{ background: '#f5f5f5', padding: '16px', borderRadius: '8px', marginTop: '16px' }}>
          <h3>待办事项</h3>
          <ul style={{ paddingLeft: '20px' }}>
            <li>完成个人资料设置</li>
            <li>浏览活动广场</li>
            <li>创建第一个活动</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default HomeDashboard;