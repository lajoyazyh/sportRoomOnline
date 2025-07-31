import { useState, useRef, useEffect } from 'react';
import ProfilePreview from './ProfilePreview';
import { getProfileApi, updateProfileApi, uploadPhotosApi, uploadAvatarApi, deletePhotoApi } from '../../api/profile';

function ProfilePage() {
  const [profile, setProfile] = useState({
    avatar: '', // base64
    nickname: '',
    name: '',
    age: '',
    gender: '',
    bodyType: '',
    height: '',
    weight: '',
  });
  const [editMsg, setEditMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef();
  const [photos, setPhotos] = useState([]); // 照片墙
  const photoInputRef = useRef();
  const MAX_PHOTOS = 6;
  const [visitorMode, setVisitorMode] = useState(true); // 默认显示预览模式
  const [likeCount] = useState(123); // 示例点赞数，可后续对接后端

  // 组件加载时获取用户资料
  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        const response = await getProfileApi();
        if (response.success && response.data) {
          const userData = response.data;
          setProfile({
            avatar: userData.avatar || '',
            nickname: userData.nickname || '',
            name: userData.name || '',
            age: userData.age || '',
            gender: userData.gender || '',
            bodyType: userData.bodyType || '',
            height: userData.height || '',
            weight: userData.weight || '',
          });
          // 设置照片墙数据
          setPhotos(userData.photos || []);
        }
      } catch (error) {
        console.error('加载用户资料失败:', error);
        setEditMsg('加载用户资料失败: ' + error.message);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  return (
    <div className="max-w-[520px] mx-auto py-10 px-10 pb-8 relative">
      <h2 className="text-center mb-8 font-bold text-[28px] text-gray-800">
        {visitorMode ? '个人资料' : '编辑资料'}
      </h2>
      {visitorMode ? (
        <ProfilePreview profile={profile} photos={photos} likeCount={likeCount} />
      ) : (
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            try {
              setLoading(true);
              setEditMsg('');
              
              // 调用后端API保存个人信息
              const response = await updateProfileApi({
                nickname: profile.nickname,
                name: profile.name,
                age: profile.age ? parseInt(profile.age) : null,
                gender: profile.gender,
                bodyType: profile.bodyType,
                height: profile.height ? parseFloat(profile.height) : null,
                weight: profile.weight ? parseFloat(profile.weight) : null,
              });
              
              if (response.success) {
                setEditMsg('保存成功！');
                // 保存成功后切换回预览模式
                setTimeout(() => {
                  setVisitorMode(true);
                  setEditMsg(''); // 清除成功消息
                }, 1500);
              }
            } catch (error) {
              console.error('保存失败:', error);
              setEditMsg('保存失败: ' + error.message);
            } finally {
              setLoading(false);
            }
          }}
        >
          {/* 头像上传区域 */}
          <div className="text-center mb-7">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              ref={fileInputRef}
              onChange={async e => {
                const file = e.target.files[0];
                if (file) {
                  try {
                    setLoading(true);
                    setEditMsg('头像上传中...');
                    
                    // 调用后端API上传头像
                    const response = await uploadAvatarApi(file);
                    if (response.success) {
                      // 更新前端状态
                      setProfile(p => ({ ...p, avatar: response.data.avatar }));
                      setEditMsg('头像上传成功！');
                    }
                  } catch (error) {
                    console.error('头像上传失败:', error);
                    setEditMsg('头像上传失败: ' + error.message);
                  } finally {
                    setLoading(false);
                  }
                }
              }}
            />
            <div
              className="w-[110px] h-[110px] rounded-full bg-gradient-to-br from-gray-200 to-white mx-auto cursor-pointer overflow-hidden flex items-center justify-center border-[2.5px] border-gray-300 shadow-md hover:shadow-lg transition-shadow"
              onClick={() => fileInputRef.current.click()}
              title="点击更换头像"
            >
              {profile.avatar ? (
                <img src={profile.avatar} alt="avatar" className="w-full h-full object-cover" />
              ) : (
                <span className="text-gray-400 text-base">上传头像</span>
              )}
            </div>
          </div>
          
          {/* 昵称字段 */}
          <div className="mb-5">
            <label className="block mb-1.5 text-sm font-medium text-gray-700">
              昵称
            </label>
            <input
              type="text"
              placeholder="请输入昵称"
              value={profile.nickname}
              onChange={e => setProfile(p => ({ ...p, nickname: e.target.value }))}
              className="w-full py-3 px-3.5 rounded-lg border-[1.5px] border-gray-300 text-base bg-blue-50 text-gray-800 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-200"
            />
          </div>
          
          {/* 姓名字段 */}
          <div className="mb-5">
            <label className="block mb-1.5 text-sm font-medium text-gray-700">
              姓名
            </label>
            <input
              type="text"
              placeholder="请输入真实姓名"
              value={profile.name}
              onChange={e => setProfile(p => ({ ...p, name: e.target.value }))}
              className="w-full py-3 px-3.5 rounded-lg border-[1.5px] border-gray-300 text-base bg-blue-50 text-gray-800 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-200"
            />
          </div>
          
          {/* 年龄和性别字段 */}
          <div className="mb-5">
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block mb-1.5 text-sm font-medium text-gray-700">
                  年龄
                </label>
                <input
                  type="number"
                  placeholder="请输入年龄"
                  min={0}
                  value={profile.age}
                  onChange={e => setProfile(p => ({ ...p, age: e.target.value }))}
                  className="w-full py-3 px-3.5 rounded-lg border-[1.5px] border-gray-300 text-base bg-blue-50 text-gray-800 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-200"
                />
              </div>
              <div className="flex-1">
                <label className="block mb-1.5 text-sm font-medium text-gray-700">
                  性别
                </label>
                <select
                  value={profile.gender}
                  onChange={e => setProfile(p => ({ ...p, gender: e.target.value }))}
                  className={`w-full py-3 px-3.5 rounded-lg border-[1.5px] border-gray-300 text-base bg-blue-50 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-200 ${profile.gender ? 'text-gray-800' : 'text-gray-400'}`}
                  required
                  defaultValue=""
                >
                  <option value="" disabled hidden>请选择性别</option>
                  <option value="male">男</option>
                  <option value="female">女</option>
                  <option value="other">其他</option>
                </select>
              </div>
            </div>
          </div>
          
          {/* 体型字段 */}
          <div className="mb-5">
            <label className="block mb-1.5 text-sm font-medium text-gray-700">
              体型
            </label>
            <select
              value={profile.bodyType}
              onChange={e => setProfile(p => ({ ...p, bodyType: e.target.value }))}
              className={`w-full py-3 px-3.5 rounded-lg border-[1.5px] border-gray-300 text-base bg-blue-50 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-200 ${profile.bodyType ? 'text-gray-800' : 'text-gray-400'}`}
              required
              defaultValue=""
            >
              <option value="" disabled hidden>请选择体型</option>
              <option value="slim">偏瘦</option>
              <option value="normal">标准</option>
              <option value="muscular">健壮</option>
              <option value="plump">偏胖</option>
            </select>
          </div>
          
          {/* 身高和体重字段 */}
          <div className="mb-5">
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block mb-1.5 text-sm font-medium text-gray-700">
                  身高 (cm)
                </label>
                <input
                  type="number"
                  placeholder="请输入身高"
                  min={0}
                  value={profile.height}
                  onChange={e => setProfile(p => ({ ...p, height: e.target.value }))}
                  className="w-full py-3 px-3.5 rounded-lg border-[1.5px] border-gray-300 text-base bg-blue-50 text-gray-800 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-200"
                />
              </div>
              <div className="flex-1">
                <label className="block mb-1.5 text-sm font-medium text-gray-700">
                  体重 (kg)
                </label>
                <input
                  type="number"
                  placeholder="请输入体重"
                  min={0}
                  value={profile.weight}
                  onChange={e => setProfile(p => ({ ...p, weight: e.target.value }))}
                  className="w-full py-3 px-3.5 rounded-lg border-[1.5px] border-gray-300 text-base bg-blue-50 text-gray-800 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-200"
                />
              </div>
            </div>
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className={`w-full mt-2.5 py-3 text-white border-none rounded-lg font-semibold text-lg shadow-md transition-all ${
              loading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 cursor-pointer hover:shadow-lg'
            }`}
          >
            {loading ? '保存中...' : '保存'}
          </button>
          {editMsg && (
            <div className="text-green-600 mt-4 text-center font-medium">
              {editMsg}
            </div>
          )}
        </form>
      )}
      
      {/* 照片墙 - 只在编辑模式下显示 */}
      {!visitorMode && (
        <div className="mt-10">
          <div className="font-semibold text-lg text-gray-800 mb-3">照片墙</div>
          <input
            type="file"
            accept="image/*"
            multiple
            ref={photoInputRef}
            className="hidden"
            onChange={async e => {
              const files = Array.from(e.target.files).slice(0, MAX_PHOTOS - photos.length);
              if (files.length) {
                try {
                  setLoading(true);
                  setEditMsg('照片上传中...');
                  
                  // 调用后端API上传照片
                  const response = await uploadPhotosApi(files);
                  if (response.success) {
                    // 重新获取用户资料以更新照片墙
                    const profileResponse = await getProfileApi();
                    if (profileResponse.success && profileResponse.data) {
                      setPhotos(profileResponse.data.photos || []);
                    }
                    setEditMsg('照片上传成功！');
                  }
                } catch (error) {
                  console.error('照片上传失败:', error);
                  setEditMsg('照片上传失败: ' + error.message);
                } finally {
                  setLoading(false);
                }
              }
              e.target.value = '';
            }}
            disabled={visitorMode}
          />
          <div className="grid grid-cols-3 gap-4 min-h-[120px]">
            {photos.map((src, idx) => (
              <div key={idx} className="relative rounded-lg overflow-hidden shadow-md bg-white">
                <img src={src} alt={`user-photo-${idx}`} className="w-full h-[110px] object-cover block" />
                {!visitorMode && (
                  <button
                    type="button"
                    onClick={async () => {
                      try {
                        setLoading(true);
                        setEditMsg('删除照片中...');
                        
                        // 调用后端API删除照片
                        const response = await deletePhotoApi(idx);
                        if (response.success) {
                          // 重新获取用户资料以更新照片墙
                          const profileResponse = await getProfileApi();
                          if (profileResponse.success && profileResponse.data) {
                            setPhotos(profileResponse.data.photos || []);
                          }
                          setEditMsg('照片删除成功！');
                        }
                      } catch (error) {
                        console.error('照片删除失败:', error);
                        setEditMsg('照片删除失败: ' + error.message);
                      } finally {
                        setLoading(false);
                      }
                    }}
                    className="absolute top-1.5 right-1.5 bg-black/55 text-white border-none rounded-full w-6 h-6 cursor-pointer font-bold text-lg leading-6 text-center p-0 hover:bg-black/70 transition-colors"
                    title="删除"
                  >×</button>
                )}
              </div>
            ))}
            {/* 田字加号上传框 */}
            {!visitorMode && photos.length < MAX_PHOTOS && (
              <div
                className="h-[110px] bg-white rounded-lg border-[2.5px] border-dashed border-gray-300 flex items-center justify-center cursor-pointer relative shadow-md hover:border-gray-400 transition-colors"
                onClick={() => photoInputRef.current.click()}
                title="上传照片"
              >
                <svg width="38" height="38" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="17" y="7" width="4" height="24" rx="2" fill="#d1d5db" />
                  <rect x="7" y="17" width="24" height="4" rx="2" fill="#d1d5db" />
                </svg>
              </div>
            )}
            {/* 占位格子，保持布局美观 */}
            {Array.from({ length: Math.max(0, MAX_PHOTOS - photos.length - (visitorMode ? 0 : 1)) }).map((_, i) => (
              <div key={`ph-empty-${i}`} className="h-[110px]" />
            ))}
          </div>
          {/* 预览/编辑切换按钮 */}
          <div className="mt-4.5 text-right">
            <button
              type="button"
              onClick={() => setVisitorMode(v => !v)}
              className="bg-gray-200 text-gray-700 border-none rounded-md py-1.5 px-4.5 font-medium text-[15px] cursor-pointer shadow-sm hover:bg-gray-300 transition-colors"
            >
              {visitorMode ? '编辑资料' : '回到预览'}
            </button>
          </div>
        </div>
      )}

      {/* 预览模式下的编辑按钮 */}
      {visitorMode && (
        <div className="mt-8 text-center">
          <button
            type="button"
            onClick={() => setVisitorMode(false)}
            className="bg-indigo-500 text-white border-none rounded-lg py-3 px-8 font-semibold text-lg cursor-pointer shadow-md hover:bg-indigo-600 transition-colors"
          >
            编辑资料
          </button>
        </div>
      )}
    </div>
  );
}

export default ProfilePage; 