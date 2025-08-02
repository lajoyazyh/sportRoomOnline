import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerApi } from '../../api/auth';

function RegisterPage() {
  const [form, setForm] = useState({ username: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // 表单验证
    if (!form.username || !form.password || !form.confirm) {
      setError('请填写所有字段');
      return;
    }
    if (form.password !== form.confirm) {
      setError('两次输入的密码不一致');
      return;
    }
    if (form.password.length < 6) {
      setError('密码长度不能少于6位');
      return;
    }

    try {
      setLoading(true);
      await registerApi({ username: form.username, password: form.password });
      setSuccess('注册成功！即将跳转到登录页...');
      // 注册成功后跳转到登录页
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setError(err.message || '注册失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen w-screen fixed left-0 top-0 z-[100] flex items-center justify-center bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/src/assets/lifting1.jpg')" }}
    >
      <div className="max-w-[520px] w-full p-10 bg-white/10 rounded-[18px] shadow-[0_8px_32px_0_rgba(207,207,211,0.6)] backdrop-blur-[16px] backdrop-saturate-[180%] border-[1.5px] border-[#e0e7ef]">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">注册</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-[22px]">
            <input
              name="username"
              type="text"
              placeholder="用户名"
              value={form.username}
              onChange={handleChange}
              disabled={loading}
              className="w-full p-[18px] rounded-[10px] border-[1.5px] border-gray-300 text-xl bg-white text-gray-700 box-border transition-all duration-200 leading-[1.6] placeholder:text-gray-400 placeholder:text-lg focus:border-[#646cff] focus:shadow-[0_0_0_2px_rgba(100,108,255,0.13)] focus:outline-none"
            />
          </div>
          <div className="mb-[22px]">
            <input
              name="password"
              type="password"
              placeholder="密码"
              value={form.password}
              onChange={handleChange}
              disabled={loading}
              className="w-full p-[18px] rounded-[10px] border-[1.5px] border-gray-300 text-xl bg-white text-gray-700 box-border transition-all duration-200 leading-[1.6] placeholder:text-gray-400 placeholder:text-lg focus:border-[#646cff] focus:shadow-[0_0_0_2px_rgba(100,108,255,0.13)] focus:outline-none"
            />
          </div>
          <div className="mb-[22px]">
            <input
              name="confirm"
              type="password"
              placeholder="确认密码"
              value={form.confirm}
              onChange={handleChange}
              disabled={loading}
              className="w-full p-[18px] rounded-[10px] border-[1.5px] border-gray-300 text-xl bg-white text-gray-700 box-border transition-all duration-200 leading-[1.6] placeholder:text-gray-400 placeholder:text-lg focus:border-[#646cff] focus:shadow-[0_0_0_2px_rgba(100,108,255,0.13)] focus:outline-none"
            />
          </div>
          {error && <div className="text-red-500 mb-2">{error}</div>}
          {success && <div className="text-green-500 mb-2">{success}</div>}
          <button 
            type="submit" 
            disabled={loading}
            className="w-full mt-[10px] py-4 bg-gradient-to-r from-[#646cff] to-[#4f8cff] text-white border-none rounded-[10px] font-bold text-[22px] cursor-pointer transition-all duration-200 tracking-wider hover:bg-gradient-to-r hover:from-[#4f8cff] hover:to-[#646cff] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? '注册中...' : '注册'}
          </button>
        </form>
        <div className="mt-4 text-center">
          <span className="text-gray-700">已有账号？ </span>
          <Link to="/login" className="text-[#646cff] no-underline hover:text-[#4f8cff] transition-colors duration-200">去登录</Link>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;