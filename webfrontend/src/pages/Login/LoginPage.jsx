import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginApi } from '../../api/auth';

function LoginPage({ onLoginSuccess }) {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.username || !form.password) {
      setError('请填写所有字段');
      return;
    }

    try {
      setLoading(true);
      // 1. 调用登录API
      const response = await loginApi({ username: form.username, password: form.password });
      // 2. 保存token到localStorage
      localStorage.setItem('token', response.token);
      // 3. 调用登录成功回调
      onLoginSuccess(response.data || response.user);
      // 4. 导航到首页
      navigate('/home');
    } catch (err) {
      setError(err.message || '登录失败，请检查用户名和密码');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen w-screen fixed left-0 top-0 z-[100] flex items-center justify-center bg-cover bg-center bg-no-repeat p-4"
      style={{ backgroundImage: "url('/src/assets/lifting1.jpg')" }}
    >
      <div className="max-w-[520px] w-full p-6 sm:p-10 bg-white/10 rounded-[18px] shadow-[0_8px_32px_0_rgba(207,207,211,0.6)] backdrop-blur-[16px] backdrop-saturate-[180%] border-[1.5px] border-[#e0e7ef]">
        <h2 className="text-xl sm:text-2xl font-bold mb-6 text-center text-gray-800">登录</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-[22px]">
            <input
              name="username"
              type="text"
              placeholder="用户名"
              value={form.username}
              onChange={handleChange}
              disabled={loading}
              className="w-full p-4 sm:p-[18px] rounded-[10px] border-[1.5px] border-gray-300 text-base sm:text-xl bg-white text-gray-700 box-border transition-all duration-200 leading-[1.6] placeholder:text-gray-400 placeholder:text-sm sm:placeholder:text-lg focus:border-[#646cff] focus:shadow-[0_0_0_2px_rgba(100,108,255,0.13)] focus:outline-none"
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
              className="w-full p-4 sm:p-[18px] rounded-[10px] border-[1.5px] border-gray-300 text-base sm:text-xl bg-white text-gray-700 box-border transition-all duration-200 leading-[1.6] placeholder:text-gray-400 placeholder:text-sm sm:placeholder:text-lg focus:border-[#646cff] focus:shadow-[0_0_0_2px_rgba(100,108,255,0.13)] focus:outline-none"
            />
          </div>
          {error && <div className="text-red-500 mb-2 text-sm sm:text-base">{error}</div>}
          <button 
            type="submit" 
            disabled={loading}
            className="w-full mt-[10px] py-4 bg-gradient-to-r from-[#646cff] to-[#4f8cff] text-white border-none rounded-[10px] font-bold text-lg sm:text-[22px] cursor-pointer transition-all duration-200 tracking-wider hover:bg-gradient-to-r hover:from-[#4f8cff] hover:to-[#646cff] disabled:opacity-50 disabled:cursor-not-allowed min-h-[48px]"
          >
            {loading ? '登录中...' : '登录'}
          </button>
        </form>
        <div className="mt-4 text-center">
          <span className="text-gray-700">没有账号？ </span>
          <Link to="/register" className="text-[#646cff] no-underline hover:text-[#4f8cff] transition-colors duration-200">去注册</Link>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;