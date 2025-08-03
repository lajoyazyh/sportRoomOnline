module.exports = {
  ...require('./jest.config.js'),
  collectCoverage: true,
  maxWorkers: 1,
  testTimeout: 60000,
  forceExit: true,
  silent: true, // 减少日志输出
};
