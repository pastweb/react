const WEB_REGEX = `__tests__/.*\\.only\\.web\\.test\\.(j|t)s(x)?$`;
const NODE_REGEX = `__tests__/.*\\.only\\.node\\.test\\.(j|t)s(x)?$`;

const common = {
  testPathIgnorePatterns: ['<rootDir>/node_modules/'],
  transform: { '^.+\\.(j|t)s(x)?$': [ 'ts-jest', { tsconfig: 'tsconfig.test.json' } ] },
  coveragePathIgnorePatterns: [ 'node_modules', WEB_REGEX, NODE_REGEX ],
  collectCoverageFrom: [ `./src/**/*.{js,jsx,ts,tsx}` ],
  coverageThreshold: {
    global: {
      branches: 0,
      functions: 5,
      lines: 5,
      statements: 5,
    },
  },
};

module.exports = {
    projects: [
      {
        ...common,
        displayName: 'dom',
        testEnvironment: 'jsdom',
        testRegex: WEB_REGEX,
        setupFilesAfterEnv: ['@testing-library/jest-dom'],
      },
      {
        ...common,
        displayName: 'node',
        testEnvironment: 'node',
        testRegex: NODE_REGEX,
      },
    ],
};
