// ManagePage.jsx
// 活动管理页面，用于创建、编辑和管理用户的活动

function ManagePage() {
  return (
    <div className="p-5">
      <h2 className="text-2xl font-bold text-gray-800 mb-5">活动管理</h2>
      <div className="mt-5 flex gap-5">
        <div className="flex-1 bg-white rounded-lg shadow-md p-4">
          <h3 className="text-xl font-semibold text-gray-700 mb-3">我的活动</h3>
          <div className="mt-3">
            <div className="p-3 border-b border-gray-200 flex justify-between items-center">
              <span className="text-gray-600">活动名称</span>
              <div>
                <button className="mr-2 px-2 py-1 bg-[#646cff] text-white border-none rounded cursor-pointer text-sm hover:bg-[#5a5ad4] transition-colors duration-200">编辑</button>
                <button className="px-2 py-1 bg-red-500 text-white border-none rounded cursor-pointer text-sm hover:bg-red-600 transition-colors duration-200">删除</button>
              </div>
            </div>
            <div className="p-3 border-b border-gray-200 flex justify-between items-center">
              <span className="text-gray-600">即将开始的活动</span>
              <div>
                <button className="mr-2 px-2 py-1 bg-[#646cff] text-white border-none rounded cursor-pointer text-sm hover:bg-[#5a5ad4] transition-colors duration-200">编辑</button>
                <button className="px-2 py-1 bg-red-500 text-white border-none rounded cursor-pointer text-sm hover:bg-red-600 transition-colors duration-200">删除</button>
              </div>
            </div>
          </div>
        </div>
        <div className="flex-none w-[200px]">
          <button className="w-full py-[10px] px-4 bg-[#646cff] text-white border-none rounded-md cursor-pointer text-base hover:bg-[#5a5ad4] transition-colors duration-200">
            创建新活动
          </button>
        </div>
      </div>
    </div>
  );
}

export default ManagePage;