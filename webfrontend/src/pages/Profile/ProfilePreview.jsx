import React from 'react';

function ProfilePreview({ profile, photos, likeCount }) {
  return (
    <div>
      <div style={{ textAlign: 'center', marginBottom: 28 }}>
        <div
          style={{
            width: 110, height: 110, borderRadius: '50%', background: 'linear-gradient(135deg, #e0e7ef 0%, #fff 100%)', margin: '0 auto', overflow: 'hidden',
            display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2.5px solid #c7d0e0',
            boxShadow: '0 2px 8px #e0e7ef',
          }}
        >
          {profile.avatar ? (
            <img src={profile.avatar} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <span style={{ color: '#b0b8c9', fontSize: 16 }}>暂无头像</span>
          )}
        </div>
        {/* 点赞数及大拇指图标预留位 */}
        <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
          {/* ===================== TODO: 在此处插入大拇指图片（如/thumb-up.svg） ===================== */}
          <span style={{ fontSize: 18, color: '#888' }}>{likeCount}</span>
        </div>
      </div>
      <div style={{ marginBottom: 18, fontSize: 18, fontWeight: 600, letterSpacing: 0.5 }}><span style={{ color: '#646cff', fontWeight: 700 }}>昵称：</span><span style={{ color: '#bbb' }}>{profile.nickname || '暂无'}</span></div>
      <div style={{ marginBottom: 18, fontSize: 18, fontWeight: 600, letterSpacing: 0.5 }}><span style={{ color: '#646cff', fontWeight: 700 }}>姓名：</span><span style={{ color: '#bbb' }}>{profile.name || '暂无'}</span></div>
      <div style={{ marginBottom: 18, fontSize: 18, fontWeight: 600, letterSpacing: 0.5 }}><span style={{ color: '#646cff', fontWeight: 700 }}>年龄：</span><span style={{ color: '#bbb' }}>{profile.age || '暂无'}</span></div>
      <div style={{ marginBottom: 18, fontSize: 18, fontWeight: 600, letterSpacing: 0.5 }}><span style={{ color: '#646cff', fontWeight: 700 }}>性别：</span><span style={{ color: '#bbb' }}>{profile.gender === 'male' ? '男' : profile.gender === 'female' ? '女' : profile.gender === 'other' ? '其他' : '暂无'}</span></div>
      <div style={{ marginBottom: 18, fontSize: 18, fontWeight: 600, letterSpacing: 0.5 }}><span style={{ color: '#646cff', fontWeight: 700 }}>体型：</span><span style={{ color: '#bbb' }}>{
        profile.bodyType === 'slim' ? '偏瘦' :
        profile.bodyType === 'normal' ? '标准' :
        profile.bodyType === 'muscular' ? '健壮' :
        profile.bodyType === 'plump' ? '偏胖' : '暂无'}</span></div>
      <div style={{ marginBottom: 18, fontSize: 18, fontWeight: 600, letterSpacing: 0.5 }}><span style={{ color: '#646cff', fontWeight: 700 }}>身高：</span><span style={{ color: '#bbb' }}>{profile.height ? profile.height + ' cm' : '暂无'}</span></div>
      <div style={{ marginBottom: 32, fontSize: 18, fontWeight: 600, letterSpacing: 0.5 }}><span style={{ color: '#646cff', fontWeight: 700 }}>体重：</span><span style={{ color: '#bbb' }}>{profile.weight ? profile.weight + ' kg' : '暂无'}</span></div>
      {/* 照片墙展示 */}
      <div style={{ marginTop: 40 }}>
        <div style={{ fontWeight: 600, fontSize: 18, color: '#222', marginBottom: 12 }}>照片墙</div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 16,
          minHeight: 120,
        }}>
          {photos && photos.length > 0 ? (
            photos.map((src, idx) => (
              <div key={idx} style={{ borderRadius: 10, overflow: 'hidden', boxShadow: '0 2px 8px #e0e7ef', background: '#fff' }}>
                <img src={src} alt={`user-photo-${idx}`} style={{ width: '100%', height: 110, objectFit: 'cover', display: 'block' }} />
              </div>
            ))
          ) : (
            <div style={{ gridColumn: '1 / span 3', color: '#aaa', textAlign: 'center', padding: 32 }}>暂无照片</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProfilePreview; 