import React from 'react';

function ProfilePreview({ profile, photos, likeCount }) {
  return (
    <div>
      {/* 头像和点赞数 */}
      <div className="text-center mb-7">
        <div className="w-[110px] h-[110px] rounded-full bg-gradient-to-br from-gray-200 to-white mx-auto overflow-hidden flex items-center justify-center border-[2.5px] border-gray-300 shadow-md">
          {profile.avatar ? (
            <img src={profile.avatar} alt="avatar" className="w-full h-full object-cover" />
          ) : (
            <span className="text-gray-400 text-base">暂无头像</span>
          )}
        </div>
        {/* 点赞数及大拇指图标预留位 */}
        <div className="mt-3.5 flex items-center justify-center gap-1.5">
          {/* ===================== TODO: 在此处插入大拇指图片（如/thumb-up.svg） ===================== */}
          <span className="text-lg text-gray-600">👍 {likeCount}</span>
        </div>
      </div>

      {/* 个人信息展示 */}
      <div className="space-y-5">
        <div className="text-lg font-semibold tracking-wide flex items-baseline">
          <span className="text-indigo-600 font-bold">昵称：</span>
          <span className="text-slate-700 ml-2 font-medium text-xl">{profile.nickname || <span className="text-gray-400 text-base italic">暂无</span>}</span>
        </div>
        <div className="text-lg font-semibold tracking-wide flex items-baseline">
          <span className="text-indigo-600 font-bold">姓名：</span>
          <span className="text-slate-700 ml-2 font-medium text-xl">{profile.name || <span className="text-gray-400 text-base italic">暂无</span>}</span>
        </div>
        <div className="text-lg font-semibold tracking-wide flex items-baseline">
          <span className="text-indigo-600 font-bold">年龄：</span>
          <span className="text-slate-700 ml-2 font-medium text-xl">{profile.age ? `${profile.age} 岁` : <span className="text-gray-400 text-base italic">暂无</span>}</span>
        </div>
        <div className="text-lg font-semibold tracking-wide flex items-baseline">
          <span className="text-indigo-600 font-bold">性别：</span>
          <span className="text-slate-700 ml-2 font-medium text-xl">
            {profile.gender === 'male' ? '👨 男' : 
             profile.gender === 'female' ? '👩 女' : 
             profile.gender === 'other' ? '⚧ 其他' : 
             <span className="text-gray-400 text-base italic">暂无</span>}
          </span>
        </div>
        <div className="text-lg font-semibold tracking-wide flex items-baseline">
          <span className="text-indigo-600 font-bold">体型：</span>
          <span className="text-slate-700 ml-2 font-medium text-xl">
            {profile.bodyType === 'slim' ? '🏃‍♂️ 偏瘦' :
             profile.bodyType === 'normal' ? '🚶‍♂️ 标准' :
             profile.bodyType === 'muscular' ? '💪 健壮' :
             profile.bodyType === 'plump' ? '🤵 偏胖' : 
             <span className="text-gray-400 text-base italic">暂无</span>}
          </span>
        </div>
        <div className="text-lg font-semibold tracking-wide flex items-baseline">
          <span className="text-indigo-600 font-bold">身高：</span>
          <span className="text-slate-700 ml-2 font-medium text-xl">
            {profile.height ? (
              <>📏 <span className="font-bold text-emerald-600">{profile.height}</span> cm</>
            ) : (
              <span className="text-gray-400 text-base italic">暂无</span>
            )}
          </span>
        </div>
        <div className="text-lg font-semibold tracking-wide mb-8 flex items-baseline">
          <span className="text-indigo-600 font-bold">体重：</span>
          <span className="text-slate-700 ml-2 font-medium text-xl">
            {profile.weight ? (
              <>⚖️ <span className="font-bold text-emerald-600">{profile.weight}</span> kg</>
            ) : (
              <span className="text-gray-400 text-base italic">暂无</span>
            )}
          </span>
        </div>
      </div>
      
      {/* 照片墙展示 */}
      <div className="mt-10">
        <div className="font-semibold text-lg text-gray-800 mb-3">照片墙</div>
        <div className="grid grid-cols-3 gap-4 min-h-[120px]">
          {photos && photos.length > 0 ? (
            photos.map((src, idx) => (
              <div key={idx} className="rounded-lg overflow-hidden shadow-md bg-white">
                <img src={src} alt={`user-photo-${idx}`} className="w-full h-[110px] object-cover block" />
              </div>
            ))
          ) : (
            <div className="col-span-3 text-gray-500 text-center py-8">暂无照片</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProfilePreview; 