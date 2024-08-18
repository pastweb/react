export default {
  versionFile: true,
  build: {
    target: 'lib',
    external: [ 'react-dom/server' ],
  },
  output: { package: true },
};
