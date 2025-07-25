// SquarePage.jsx
// 活动广场页面，展示各类活动列表和推荐内容

function SquarePage() {
  return (
    <div style={{ padding: '20px' }}>
      <h2>活动广场</h2>
      <div style={{ marginTop: '20px' }}>
        <div style={{ background: '#fff', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', padding: '16px', marginBottom: '16px' }}>
          <h3>推荐活动</h3>
          <div style={{ display: 'flex', gap: '16px', marginTop: '12px' }}>
            <div style={{ flex: 1, padding: '12px', border: '1px solid #e0e0e0', borderRadius: '6px' }}>活动 1</div>
            <div style={{ flex: 1, padding: '12px', border: '1px solid #e0e0e0', borderRadius: '6px' }}>活动 2</div>
            <div style={{ flex: 1, padding: '12px', border: '1px solid #e0e0e0', borderRadius: '6px' }}>活动 3</div>
          </div>
        </div>
        <div style={{ background: '#fff', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', padding: '16px' }}>
          <h3>最新活动</h3>
          <div style={{ marginTop: '12px' }}>
            <div style={{ padding: '12px', borderBottom: '1px solid #e0e0e0' }}>最新活动 1</div>
            <div style={{ padding: '12px', borderBottom: '1px solid #e0e0e0' }}>最新活动 2</div>
            <div style={{ padding: '12px' }}>最新活动 3</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SquarePage;