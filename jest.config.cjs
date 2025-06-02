// Jest configuration file for a Node.js project
module.exports = {
  testEnvironment: "node",
  collectCoverage: true,
  coverageDirectory: "coverage",
  testMatch: ["**/*.test.js"],
  verbose: true,
  transform: {
    "^.+\\.js$": "babel-jest",
  },
};
