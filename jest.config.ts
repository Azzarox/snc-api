import type { Config } from 'jest';

const config: Config = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    verbose: true,
    // setupFiles: ['<rootDir>/tests/setup/env.ts'],
    // setupFilesAfterEnv: ["<rootDir>/tests/setup/setup.ts"],
    // globalSetup: '<rootDir>/tests/setup/globalSetup.ts',

    testMatch: [
        '<rootDir>/src/**/*.spec.ts',
        '<rootDir>/src/**/*.test.ts',
        '<rootDir>/tests/**/*.(spec|test).ts'
    ],
    // collectCoverage: true,
    // collectCoverageFrom: [
    //     'src/**/*.{ts,tsx}',
    //     '!src/**/*.spec.ts', 
    //     '!src/**/*.test.ts',
    //     '!src/types/**',     
    //     '!src/config/**',  
    //     '!src/app.ts',      
    // ],
    // coverageDirectory: 'coverage', 
    // coverageReporters: ['text', 'lcov', 'html'], 
    // coverageThreshold: {
    //     'global': {
    //         'statements': 85,
    //         'branches': 85,
    //         'functions': 85,
    //         'lines': 85
    //     }
    // },
    modulePathIgnorePatterns: ['<rootDir>/dist/'],
};

export default config;