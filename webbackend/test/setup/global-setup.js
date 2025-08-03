const fs = require('fs');
const path = require('path');

module.exports = async () => {
  console.log('🧪 Setting up test environment...');
  
  // 清理测试数据库文件
  const testDbPath = path.join(__dirname, '../../test.db');
  if (fs.existsSync(testDbPath)) {
    fs.unlinkSync(testDbPath);
    console.log('🗑️  Cleaned up test database');
  }
  
  // 设置测试环境变量
  process.env.NODE_ENV = 'unittest';
  process.env.MIDWAY_SERVER_ENV = 'unittest';
  
  console.log('✅ Test environment setup complete');
};
