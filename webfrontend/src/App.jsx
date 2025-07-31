import { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import LoginPage from './pages/Login/LoginPage';
import RegisterPage from './pages/Register/RegisterPage';
import HomePage from './pages/Home/HomePage';
import HomeDashboard from './pages/Home/HomeDashboard';
import SquarePage from './pages/Square/SquarePage';
import ManagePage from './pages/Manage/ManagePage';
import ProfilePage from './pages/Profile/ProfilePage';
import { getProfileApi } from './api/profile';

function App() {
  const [user, setUser] = useState(null);      // 存储当前登录用户信息
  const [loading, setLoading] = useState(true); // 控制应用初始化加载状态
  const navigate = useNavigate();               // 路由导航工具
  const location = useLocation();               // 当前路由位置信息

  // 验证用户登录状态
  useEffect(() => {
    const abortController = new AbortController(); 
    // 用于取消请求。什么是AbortController？ 它是一个可以用来取消异步操作的对象，
    // abortController的所有方法：
    // abort()：取消当前的异步操作。
    // throwIfAborted()：如果当前的异步操作已被取消，则抛出AbortError异常。
    // signal：一个只读属性，返回一个AbortSignal对象，用于取消异步操作。

    const verifyAuth = async () => {
      try {
        const userData = await getProfileApi({ signal: abortController.signal });

        // 直接使用API返回数据，不进行额外验证
        setUser(userData.data || userData);
        // 路由保护：未在/home路径则重定向
        if (!location.pathname.startsWith('/home')) {
          navigate('/home');
        }
      } catch (error) {
        // 错误处理：清除用户状态并重定向到登录页
        setUser(null);
        if (error.name !== 'AbortError') {
          // 只有当当前路径不是登录或注册页面时才重定向到登录
          if (!['/login', '/register'].includes(location.pathname)) {
            navigate('/login');
          }
        }
      } finally {
          setLoading(false);
      }
    };

    verifyAuth();

    // 组件卸载时取消请求
    return () => abortController.abort();
  }, [navigate, location.pathname]);

  // 加载状态显示
  if (loading) return <div className="loading">加载中...</div>;

  return (
    <Routes>
      {/* 公共路由 */}
      <Route path="/login" element={!user ? <LoginPage onLoginSuccess={(userData) => setUser(userData)} /> : <Navigate to="/home" />} />
      <Route path="/register" element={!user ? <RegisterPage /> : <Navigate to="/home" />} />
      
      {/* 需要授权的路由 */}
      <Route path="/home" element={user ? <HomePage onLogout={() => {
        setUser(null);
        localStorage.removeItem('token');
        navigate('/login');
      }} /> : <Navigate to="/login" />}>
        <Route index element={<HomeDashboard />} />
        <Route path="square" element={<SquarePage />} />
        <Route path="manage" element={<ManagePage />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>
      
      {/* 重定向规则 */}
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="*" element={<Navigate to={user ? "/home" : "/login"} />} />
    </Routes>
  );
}

export default App;
