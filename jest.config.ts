import nextJest from 'next/jest.js'
 
const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
})
 
// Add any custom config to be passed to Jest
const config = {
  coverageProvider: 'v8',
  testEnvironment: "jest-environment-jsdom",
  moduleNameMapper: {
  // ...
  '^@/components/(.*)$': '<rootDir>/components/$1',
},
  // Add more setup options before each test is run
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  transform: {
    // Use babel-jest for all JS files (including node_modules/jose)
    "^.+\\.(js|jsx|ts|tsx)$": "babel-jest",
  },
  transformIgnorePatterns: [
    // Explicitly allow transpilation of `jose` (ignore other node_modules)
    "/node_modules/(?!(jose|@panva|next-auth)/)",
  ],
}
 
// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
export default createJestConfig(config)
