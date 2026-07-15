export default {
  testEnvironment: 'node',
  transform: {
    '^.+\\.js$': ['babel-jest', { configFile: './.babelrc' }],
  },
  transformIgnorePatterns: ['node_modules/(?!(file-type|strtok3|token-types|peek-readable)/)'],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.test.js'],
  setupFilesAfterSetup: [],
  verbose: true,
  forceExit: true,
  detectOpenHandles: true,
};
