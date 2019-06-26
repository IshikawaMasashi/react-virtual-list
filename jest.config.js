module.exports = {
  verbose: true,
  roots: [
    "<rootDir>/"
  ],
  transform: {
    "^.+\\.tsx?$": "ts-jest"
  },
  testRegex: "(/tests/.*|(\\.|/)(test|spec))\\.tsx?$",
  testPathIgnorePatterns: [
    "<rootDir>/node_modules/",
    "<rootDir>/tests/setupTests.ts"
  ],
  moduleFileExtensions: [
    "ts",
    "tsx",
    "js",
    "jsx",
    "json",
    "node"
  ],
  setupFiles: [
    "raf/polyfill",
    "<rootDir>/tests/setupTests.ts"
  ]
}