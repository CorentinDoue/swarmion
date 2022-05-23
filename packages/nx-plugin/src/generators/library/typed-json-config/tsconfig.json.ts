import { joinPathFragments } from '@nrwl/devkit';

import { NormalizedSchema, TsConfig } from '../../types';

export const packageTsConfig = (options: NormalizedSchema): TsConfig => ({
  extends: joinPathFragments(options.offsetFromRoot, 'tsconfig.json'),
  compilerOptions: {
    baseUrl: 'src',
    paths: {
      '@/*': ['*'],
    },
    composite: true,
    // @ts-expect-error ttypescript types are not defined
    plugins: [{ transform: '@zerollup/ts-transform-paths' }],
    emitDeclarationOnly: true,
    outDir: './dist/types',
  },
  exclude: ['./dist'],
  include: ['./**/*.ts', './tsconfig.json'],
});
