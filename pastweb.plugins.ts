import { builder } from '../cli-builder/src';

export default builder([
  {
    build: { versionFile: true },
  },
  {
    entry: 'src/createReduxAsyncStore/index.ts',
    output: {
      dir: 'createReduxAsyncStore',
      types: 'types/createReduxAsyncStore',
      package: {
        peerDependenciesMeta: {
          '@reduxjs/toolkit': { optional: true },
          'react-redux': { optional: true },
        },
      },
    },
  },
]);
