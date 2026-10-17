module.exports = {
    testEnvironment: 'node',
    testMatch: ['**/tests/**/*.test.js'],
    setupFiles: ['<rootDir>/tests/env.js'],
    setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
    verbose: true,
    maxWorkers: 1,
    transform: {
        '^.+\\.(t|j)sx?$': '@swc/jest',
    },
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
};