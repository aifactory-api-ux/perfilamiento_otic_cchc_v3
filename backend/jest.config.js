/* eslint-disable */
/**
 * Jest configuration for backend end-to-end tests.
 * This config is optimized for NestJS with TypeScript and supertest.
 */

module.exports = {
  rootDir: '.',
  testEnvironment: 'node',
  testRegex: '.e2e-spec\.ts$',
  moduleFileExtensions: [
    'js',
    'json',
    'ts',
  ],
  transform: {
    '^.+\.(t|j)s$': [
      'ts-jest',
      {
        tsconfig: 'tsconfig.json',
        isolatedModules: true,
        diagnostics: false,
        useESM: false,
      },
    ],
  },
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/dist/',
  ],
  modulePathIgnorePatterns: [
    '<rootDir>/dist/',
  ],
  moduleDirectories: [
    'node_modules',
    'src',
  ],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/main.ts',
    '!src/**/*.module.ts',
    '!src/**/dto/*.ts',
    '!src/**/entities/*.ts',
  ],
  coverageDirectory: '<rootDir>/coverage',
  coverageReporters: [
    'text',
    'text-summary',
    'lcov',
  ],
  coveragePathIgnorePatterns: [
    '<rootDir>/src/main.ts',
    '<rootDir>/src/**/dto/',
    '<rootDir>/src/**/entities/',
    '<rootDir>/src/**/interfaces/',
    '<rootDir>/src/**/migrations/',
    '<rootDir>/src/**/seeds/',
  ],
  testTimeout: 30000,
  verbose: true,
  maxWorkers: 2,
  clearMocks: true,
  restoreMocks: true,
  resetMocks: false,
  errorOnDeprecated: true,
  detectOpenHandles: true,
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json',
      isolatedModules: true,
    },
  },
  reporters: [
    'default',
  ],
  snapshotSerializers: [],
  watchPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/dist/',
  ],
  testSequencer: '@jest/test-sequencer',
};
