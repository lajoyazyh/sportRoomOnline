// SquarePage.jsx
// 活动广场页面，展示各类活动列表和推荐内容

function SquarePage() {
  return (
    <div className="p-5">
      <h2 className="text-2xl font-bold text-gray-800 mb-5">活动广场</h2>
      <div className="mt-5">
        <div className="bg-white rounded-lg shadow-md p-4 mb-4">
          <h3 className="text-xl font-semibold text-gray-700 mb-3">推荐活动</h3>
          <div className="flex gap-4 mt-3">
            <div className="flex-1 p-3 border border-gray-200 rounded-md text-gray-600">活动 1</div>
            <div className="flex-1 p-3 border border-gray-200 rounded-md text-gray-600">活动 2</div>
            <div className="flex-1 p-3 border border-gray-200 rounded-md text-gray-600">活动 3</div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <h3 className="text-xl font-semibold text-gray-700 mb-3">最新活动</h3>
          <div className="mt-3">
            <div className="p-3 border-b border-gray-200 text-gray-600">最新活动 1</div>
            <div className="p-3 border-b border-gray-200 text-gray-600">最新活动 2</div>
            <div className="p-3 text-gray-600">最新活动 3</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SquarePage;