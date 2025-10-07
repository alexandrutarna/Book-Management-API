// jest.config.mjs
export default {
    testEnvironment: 'node',
    // Transpile ESM test/app files to CJS for Jest's runtime
    transform: {
        '^.+\\.(mjs|js)$': ['@swc/jest', {
            jsc: { target: 'es2022', parser: { syntax: 'ecmascript' } },
            module: { type: 'commonjs' }
        }]
    },
    testMatch: ['<rootDir>/tests/**/*.test.(js|mjs)'],
    collectCoverage: true,
    collectCoverageFrom: ['src/**/*.js', '!src/server.js'],
}
