import { pathsToModuleNameMapper } from 'ts-jest/dist/config';
import { InitialOptionsTsJest } from 'ts-jest/dist/types';

import { jestConfig } from '@swarmion/configuration';

import { compilerOptions } from './tsconfig.json';

const config: InitialOptionsTsJest = {
  ...jestConfig,
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: `<rootDir>/${compilerOptions.baseUrl}`,
  }),
};

export default config;
