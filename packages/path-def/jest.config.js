module.exports = {
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.ts'],
  coverageDirectory: '<rootDir>/coverage/',
  coveragePathIgnorePatterns: ['/index\\.ts$'],
  coverageReporters: ['lcov', 'text-summary', 'cobertura'],
  moduleDirectories: [
    '<rootDir>/node_modules/',
    '<rootDir>/../../node_modules/',
  ],
  moduleFileExtensions: ['js', 'ts'],
  testRegex: '\\.test\\.ts$',
  transform: {
    '\\.ts$': 'ts-jest',
  },
  unmockedModulePathPatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/../../node_modules/',
  ],
};
