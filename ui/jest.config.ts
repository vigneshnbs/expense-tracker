export default {
  preset: 'ts-jest',
  testEnvironment: 'jest-fixed-jsdom',
  transform: {
    '^.+\\.css$': 'jest-preview/transforms/css',
  },
  transformIgnorePatterns: [
    '[/\\\\]node_modules[/\\\\].+\\.(js|jsx|mjs|cjs|ts|tsx)$',
  ],
  testEnvironmentOptions: {
    customExportConditions: [''],
  },
  moduleNameMapper: {
    '\\.svg\\?react$': '<rootDir>/__mocks__/svg.ts',
    '^.+\\.css\\?inline': '<rootDir>/__mocks__/style.ts',
    '^src/(.*)$': '<rootDir>/src/$1',
    '^~(.*)': '<rootDir>/node_modules/$1', // Support import ~
  },
  setupFiles: ['./jest.polyfills.ts'],
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  modulePathIgnorePatterns: ['./dist/', './node_modules', './.pnpm-store'],
  coveragePathIgnorePatterns: [
    './src/env-config.ts',
    './src/testing-helpers',
    './src/types',
  ],
  collectCoverageFrom: [
    './src/**/*.ts',
    './src/**/*.tsx',
    '!./src/**/*.test.ts',
    '!./src/**/*.test.tsx',
  ],
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
};
