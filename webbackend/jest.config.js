module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testPathIgnorePatterns: ['<rootDir>/test/fixtures'],
  coveragePathIgnorePatterns: ['<rootDir>/test/'],
  maxWorkers: 1,
  testTimeout: 30000,
  forceExit: true,
  detectOpenHandles: true,
  collectCoverage: false, // 只在需要时开启
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