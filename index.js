const path = require("path");

module.exports = {
  agenticDir: path.resolve(__dirname, ".agentic"),
  opencodeDir: path.resolve(__dirname, ".opencode"),
  config: require(path.resolve(__dirname, ".agentic", "config.json")),
  schemas: {
    analysis: require(path.resolve(__dirname, ".agentic", "schemas", "analysis.json")),
    planning: require(path.resolve(__dirname, ".agentic", "schemas", "planning.json")),
    implementation: require(path.resolve(__dirname, ".agentic", "schemas", "implementation.json")),
    verification: require(path.resolve(__dirname, ".agentic", "schemas", "verification.json")),
    orchestration: require(path.resolve(__dirname, ".agentic", "schemas", "orchestration.json")),
  },
};
