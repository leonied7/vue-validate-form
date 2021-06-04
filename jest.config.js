module.exports = {
  setupFilesAfterEnv: ['<rootDir>/tests/unit/testSetup.js'],
  moduleNameMapper: {
    '^vue$': 'vue/dist/vue.common.js'
  },
  moduleFileExtensions: ['js', 'vue'],
  transform: {
    '^.+\\.js$': 'babel-jest',
    '.*\\.(vue)$': 'vue-jest'
  },
  testEnvironment: 'jsdom',
  clearMocks: true,
  collectCoverage: true,
  collectCoverageFrom: ['<rootDir>/src/**/*.js']
};
