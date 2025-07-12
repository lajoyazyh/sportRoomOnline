import { useState, useRef } from 'react';
import ProfilePreview from './ProfilePreview';
import './profile-page.css';

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
  const fileInputRef = useRef();
  const [photos, setPhotos] = useState([]); // 照片墙
  const photoInputRef = useRef();
  const MAX_PHOTOS = 6;
  const [visitorMode, setVisitorMode] = useState(false);
  const [likeCount] = useState(123); // 示例点赞数，可后续对接后端

  return (
    <div style={{
      maxWidth: 520,
      margin: '0 auto',
      padding: '40px 40px 32px 40px',
      position: 'relative',
    }}>
      <h2 style={{ textAlign: 'center', marginBottom: 32, fontWeight: 700, fontSize: 28, color: '#222' }}>个人信息</h2>
      {visitorMode ? (
        <ProfilePreview profile={profile} photos={photos} likeCount={likeCount} />
      ) : (
        <form
          onSubmit={e => {
            e.preventDefault();
            // ===================== 后续对接后端API：保存个人信息 =====================
            setEditMsg('保存成功！（演示）');
            // TODO: 这里可调用后端API保存
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <input
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              ref={fileInputRef}
              onChange={e => {
                const file = e.target.files[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = ev => setProfile(p => ({ ...p, avatar: ev.target.result }));
                  reader.readAsDataURL(file);
                  // ===================== 后续可上传头像到后端或云存储 =====================
                }
              }}
            />
            <div
              style={{
                width: 110, height: 110, borderRadius: '50%', background: 'linear-gradient(135deg, #e0e7ef 0%, #fff 100%)', margin: '0 auto', cursor: 'pointer', overflow: 'hidden',
                display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2.5px solid #c7d0e0',
                boxShadow: '0 2px 8px #e0e7ef',
              }}
              onClick={() => fileInputRef.current.click()}
              title="点击更换头像"
            >
              {profile.avatar ? (
                <img src={profile.avatar} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <span style={{ color: '#b0b8c9', fontSize: 16 }}>上传头像</span>
              )}
            </div>
          </div>
          <div style={{ marginBottom: 20 }}>
            <input
              type="text"
              placeholder="昵称"
              value={profile.nickname}
              onChange={e => setProfile(p => ({ ...p, nickname: e.target.value }))}
              style={{ width: '100%', padding: '12px 14px', borderRadius: 8, border: '1.5px solid #d1d5db', fontSize: 16, background: '#f7fafd', color: '#222', marginBottom: 0 }}
            />
          </div>
          <div style={{ marginBottom: 20 }}>
            <input
              type="text"
              placeholder="姓名"
              value={profile.name}
              onChange={e => setProfile(p => ({ ...p, name: e.target.value }))}
              style={{ width: '100%', padding: '12px 14px', borderRadius: 8, border: '1.5px solid #d1d5db', fontSize: 16, background: '#f7fafd', color: '#222', marginBottom: 0 }}
            />
          </div>
          <div style={{ marginBottom: 20, display: 'flex', gap: 16 }}>
            <input
              type="number"
              placeholder="年龄"
              min={0}
              value={profile.age}
              onChange={e => setProfile(p => ({ ...p, age: e.target.value }))}
              style={{ flex: 1, padding: '12px 14px', borderRadius: 8, border: '1.5px solid #d1d5db', fontSize: 16, background: '#f7fafd', color: '#222' }}
            />
            <select
              value={profile.gender}
              onChange={e => setProfile(p => ({ ...p, gender: e.target.value }))}
              style={{ flex: 1, padding: '12px 14px', borderRadius: 8, border: '1.5px solid #d1d5db', fontSize: 16, background: '#f7fafd', color: profile.gender ? '#444' : '#bbb' }}
              required
              defaultValue=""
            >
              <option value="" disabled hidden>性别</option>
              <option value="male">男</option>
              <option value="female">女</option>
              <option value="other">其他</option>
            </select>
          </div>
          <div style={{ marginBottom: 20 }}>
            <select
              value={profile.bodyType}
              onChange={e => setProfile(p => ({ ...p, bodyType: e.target.value }))}
              style={{ width: '100%', padding: '12px 14px', borderRadius: 8, border: '1.5px solid #d1d5db', fontSize: 16, background: '#f7fafd', color: profile.bodyType ? '#444' : '#bbb' }}
              required
              defaultValue=""
            >
              <option value="" disabled hidden>体型</option>
              <option value="slim">偏瘦</option>
              <option value="normal">标准</option>
              <option value="muscular">健壮</option>
              <option value="plump">偏胖</option>
            </select>
          </div>
          <div style={{ marginBottom: 20, display: 'flex', gap: 16 }}>
            <input
              type="number"
              placeholder="身高(cm)"
              min={0}
              value={profile.height}
              onChange={e => setProfile(p => ({ ...p, height: e.target.value }))}
              style={{ flex: 1, padding: '12px 14px', borderRadius: 8, border: '1.5px solid #d1d5db', fontSize: 16, background: '#f7fafd', color: '#222' }}
            />
            <input
              type="number"
              placeholder="体重(kg)"
              min={0}
              value={profile.weight}
              onChange={e => setProfile(p => ({ ...p, weight: e.target.value }))}
              style={{ flex: 1, padding: '12px 14px', borderRadius: 8, border: '1.5px solid #d1d5db', fontSize: 16, background: '#f7fafd', color: '#222' }}
            />
          </div>
          <button type="submit" style={{ width: '100%', marginTop: 10, padding: '12px 0', background: 'linear-gradient(90deg, #646cff 0%, #4f8cff 100%)', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 600, fontSize: 18, cursor: 'pointer', boxShadow: '0 2px 8px #e0e7ef' }}>
            保存
          </button>
          {editMsg && <div style={{ color: '#1cb47c', marginTop: 16, textAlign: 'center', fontWeight: 500 }}>{editMsg}</div>}
        </form>
      )}
      {/* 照片墙 */}
      <div style={{ marginTop: 40 }}>
        <div style={{ fontWeight: 600, fontSize: 18, color: '#222', marginBottom: 12 }}>照片墙</div>
        <input
          type="file"
          accept="image/*"
          multiple
          ref={photoInputRef}
          style={{ display: 'none' }}
          onChange={e => {
            const files = Array.from(e.target.files).slice(0, MAX_PHOTOS - photos.length);
            if (files.length) {
              Promise.all(files.map(file => {
                return new Promise(resolve => {
                  const reader = new FileReader();
                  reader.onload = ev => resolve(ev.target.result);
                  reader.readAsDataURL(file);
                  // ===================== 后续可上传照片到后端或云存储 =====================
                });
              })).then(imgs => setPhotos(p => [...p, ...imgs].slice(0, MAX_PHOTOS)));
            }
            e.target.value = '';
          }}
          disabled={visitorMode}
        />
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 16,
          minHeight: 120,
        }}>
          {photos.map((src, idx) => (
            <div key={idx} style={{ position: 'relative', borderRadius: 10, overflow: 'hidden', boxShadow: '0 2px 8px #e0e7ef', background: '#fff' }}>
              <img src={src} alt={`user-photo-${idx}`} style={{ width: '100%', height: 110, objectFit: 'cover', display: 'block' }} />
              {!visitorMode && (
                <button
                  type="button"
                  onClick={() => setPhotos(p => p.filter((_, i) => i !== idx))}
                  style={{
                    position: 'absolute', top: 6, right: 6, background: 'rgba(0,0,0,0.55)', color: '#fff', border: 'none', borderRadius: '50%', width: 24, height: 24, cursor: 'pointer', fontWeight: 700, fontSize: 16, lineHeight: '24px', textAlign: 'center', padding: 0
                  }}
                  title="删除"
                >×</button>
              )}
            </div>
          ))}
          {/* 田字加号上传框 */}
          {!visitorMode && photos.length < MAX_PHOTOS && (
            <div
              style={{
                height: 110,
                background: '#fff',
                borderRadius: 10,
                border: '2.5px dashed #d1d5db',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer',
                position: 'relative',
                boxShadow: '0 2px 8px #e0e7ef',
                transition: 'border-color 0.2s',
              }}
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
            <div key={`ph-empty-${i}`} style={{ height: 110 }} />
          ))}
        </div>
        {/* 预览/返回编辑按钮 */}
        <div style={{ marginTop: 18, textAlign: 'right' }}>
          <button
            type="button"
            onClick={() => setVisitorMode(v => !v)}
            style={{
              background: '#e5e7eb', color: '#444', border: 'none', borderRadius: 6, padding: '6px 18px', fontWeight: 500, fontSize: 15, cursor: 'pointer', boxShadow: '0 1px 3px #e0e7ef',
            }}
          >
            {visitorMode ? '返回编辑' : '预览'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage; 