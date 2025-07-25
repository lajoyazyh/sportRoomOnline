// ManagePage.jsx
// 活动管理页面，用于创建、编辑和管理用户的活动

function ManagePage() {
  return (
    <div style={{ padding: '20px' }}>
      <h2>活动管理</h2>
      <div style={{ marginTop: '20px', display: 'flex', gap: '20px' }}>
        <div style={{ flex: 1, background: '#fff', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', padding: '16px' }}>
          <h3>我的活动</h3>
          <div style={{ marginTop: '12px' }}>
            <div style={{ padding: '12px', borderBottom: '1px solid #e0e0e0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>活动名称</span>
              <div>
                <button style={{ marginRight: '8px', padding: '4px 8px', background: '#646cff', color: 'white', border: 'none', borderRadius: '4px' }}>编辑</button>
                <button style={{ padding: '4px 8px', background: '#ff4d4f', color: 'white', border: 'none', borderRadius: '4px' }}>删除</button>
              </div>
            </div>
            <div style={{ padding: '12px', borderBottom: '1px solid #e0e0e0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>即将开始的活动</span>
              <div>
                <button style={{ marginRight: '8px', padding: '4px 8px', background: '#646cff', color: 'white', border: 'none', borderRadius: '4px' }}>编辑</button>
                <button style={{ padding: '4px 8px', background: '#ff4d4f', color: 'white', border: 'none', borderRadius: '4px' }}>删除</button>
              </div>
            </div>
          </div>
        </div>
        <div style={{ flex: '0 0 200px' }}>
          <button style={{ width: '100%', padding: '10px', background: '#646cff', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '16px' }}>
            创建新活动
          </button>
        </div>
      </div>
    </div>
  );
}

export default ManagePage;