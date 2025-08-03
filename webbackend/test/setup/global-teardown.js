const fs = require('fs');
const path = require('path');

module.exports = async () => {
  console.log('🧹 Cleaning up test environment...');
  
  // 清理测试数据库文件
  const testDbPath = path.join(__dirname, '../../test.db');
  if (fs.existsSync(testDbPath)) {
    try {
      fs.unlinkSync(testDbPath);
      console.log('🗑️  Cleaned up test database');
    } catch (error) {
      console.warn('⚠️  Could not clean up test database:', error.message);
    }
  }
  
  console.log('✅ Test environment cleanup complete');
};
