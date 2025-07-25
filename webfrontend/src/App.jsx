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
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // 验证用户登录状态
  useEffect(() => {
    const abortController = new AbortController();
    
    const verifyAuth = async () => {
      try {
        const userData = await getProfileApi({ signal: abortController.signal });

        // 直接使用API返回数据，不进行额外验证
        setUser(userData.data || userData);
        // 仅在当前不在/home路径下时才导航
        if (!location.pathname.startsWith('/home')) {
          navigate('/home');
        }
      } catch (error) {
        // 无论何种错误都重置用户状态
        setUser(null);
        if (error.name !== 'AbortError') {
          // 只有当当前路径不是登录或注册页面时才重定向到登录
          if (!['/login', '/register'].includes(location.pathname)) {
            navigate('/login');
          }
        }
      } finally {
        if (abortController.signal.aborted === false) {
          setLoading(false);
        }
      }
    };

    verifyAuth();
    
    return () => abortController.abort();
  }, [navigate, location.pathname]);

  // 加载状态显示
  if (loading) return <div className="loading">加载中...</div>;

  return (
    <Routes>
      {/* 公共路由 */}
      <Route path="/login" element={!user ? <LoginPage onLoginSuccess={setUser} /> : <Navigate to="/home" />} />
      <Route path="/register" element={!user ? <RegisterPage /> : <Navigate to="/home" />} />
      
      {/* 需要授权的路由 */}
      <Route path="/home" element={user ? <HomePage onLogout={() => {
        setUser(null);
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
