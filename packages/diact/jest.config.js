module.exports = {
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.ts', 'src/**/*.tsx'],
  coverageDirectory: '<rootDir>/coverage/',
  coveragePathIgnorePatterns: ['/index\\.tsx?$'],
  coverageReporters: ['lcov', 'text-summary', 'cobertura'],
  moduleDirectories: [
    '<rootDir>/node_modules/',
    '<rootDir>/../../node_modules/',
  ],
  moduleFileExtensions: ['js', 'ts', 'tsx'],
  testRegex: '\\.test\\.tsx?$',
  transform: {
    '\\.tsx?$': 'ts-jest',
  },
  unmockedModulePathPatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/../../node_modules/',
  ],
};
