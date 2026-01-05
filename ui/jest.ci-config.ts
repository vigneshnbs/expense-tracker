import config from './jest.config';

export default {
  ...config,
  reporters: ['default', 'jest-junit'],
  coverageThreshold: {},
};
