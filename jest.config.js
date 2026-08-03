const path = require('node:path');
const ts = require('typescript');
const { pathsToModuleNameMapper } = require('ts-jest');

const { config } = ts.readConfigFile(
  path.join(__dirname, 'tsconfig.json'),
  ts.sys.readFile,
);

module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: 'src',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: ['**/*.(t|j)s'],
  coverageDirectory: '../coverage',
  testEnvironment: 'node',
  moduleNameMapper: pathsToModuleNameMapper(
    config.compilerOptions.paths ?? {},
    {
      prefix: '<rootDir>/../',
    },
  ),
};
