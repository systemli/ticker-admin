import type { Config } from '@jest/types'

const config: Config.InitialOptions = {
  verbose: false,
  testEnvironment: 'jsdom',
  preset: 'ts-jest',
  moduleNameMapper: {
    'react-leaflet': '<rootDir>/src/__mocks__/react-leaflet.tsx',
    '^.+.(css|styl|less|sass|scss|png|jpg|ttf|woff|woff2)$':
      'jest-transform-stub',
  },
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
    '^.+\\.(js|jsx)$': 'babel-jest',
    '.+\\.(css|styl|less|sass|scss|png|jpg|ttf|woff|woff2)$':
      'jest-transform-stub',
  },
  transformIgnorePatterns: ['<rootDir>/node_modules/(?!react-leaflet)'],
  setupFilesAfterEnv: ['./jest-setup.ts'],
  collectCoverageFrom: ['src/**/*.{ts,tsx}'],
}
export default config
