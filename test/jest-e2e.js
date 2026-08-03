const path = require('node:path');
const ts = require('typescript');
const { pathsToModuleNameMapper } = require('ts-jest');

const { config } = ts.readConfigFile(
  path.join(__dirname, '..', 'tsconfig.json'),
  ts.sys.readFile,
);

module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',
  testEnvironment: 'node',
  testRegex: '.e2e-spec.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  moduleNameMapper: pathsToModuleNameMapper(
    config.compilerOptions.paths ?? {},
    {
      prefix: '<rootDir>/../',
    },
  ),
};
