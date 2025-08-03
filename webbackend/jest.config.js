module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testPathIgnorePatterns: ['<rootDir>/test/fixtures'],
  coveragePathIgnorePatterns: ['<rootDir>/test/'],
  // 增加超时时间
  testTimeout: 30000,
  // 避免并发测试导致的数据库锁定
  maxWorkers: 1,
  // 设置覆盖率阈值
  coverageThreshold: {
    global: {
      branches: 50,
      functions: 50,
      lines: 50,
      statements: 50,
    },
  },
  // 清理配置
  clearMocks: true,
  restoreMocks: true,
  // 测试运行前后的钩子
  globalSetup: '<rootDir>/test/setup/global-setup.js',
  globalTeardown: '<rootDir>/test/setup/global-teardown.js',
};