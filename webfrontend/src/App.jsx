import { useEffect, useState } from 'react';
import LoginRegister from './pages/Login/LoginRegister';
import Home from './pages/Home/Home';
import { getProfileApi } from './api/profile';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProfileApi()
      .then(data => {
        console.log('获取个人信息成功:', data);
        setUser(data.data || data.user || data);
        setLoading(false);
      })
      .catch(error => {
        console.error('获取个人信息失败:', error);
        setUser(null);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>加载中...</div>;
  if (!user) return <LoginRegister />;
  return <Home user={user} />;
}

export default App;
