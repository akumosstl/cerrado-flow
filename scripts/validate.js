const fs = require("fs");
const path = require("path");

const required = [
  ".agentic/config.json",
  ".agentic/schemas/analysis.json",
  ".agentic/schemas/planning.json",
  ".agentic/schemas/implementation.json",
  ".agentic/schemas/verification.json",
  ".opencode/commands/analyze.md",
  ".opencode/commands/plan.md",
  ".opencode/agents/analyzer.md",
  ".opencode/agents/planner.md",
  "install.js",
  "cli.js",
  "index.js",
];

const missing = required.filter((f) => !fs.existsSync(path.resolve(__dirname, "..", f)));

if (missing.length > 0) {
  console.error("Arquivos obrigatorios ausentes:");
  missing.forEach((f) => console.error(`  - ${f}`));
  process.exit(1);
}

console.log("Validacao pre-publish OK");
