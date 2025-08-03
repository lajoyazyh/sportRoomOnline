module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testPathIgnorePatterns: ['<rootDir>/test/fixtures'],
  coveragePathIgnorePatterns: ['<rootDir>/test/'],
  maxWorkers: 1,
  testTimeout: 60000,
  forceExit: true,
  detectOpenHandles: false, // 关闭检测，减少噪音
  collectCoverage: false,
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  collectCoverageFrom: [
    'src/**/*.{js,ts}',
    '!src/**/*.d.ts',
    '!src/entity/**',
    '!src/interface.ts',
    '!src/configuration.ts'
  ]
};