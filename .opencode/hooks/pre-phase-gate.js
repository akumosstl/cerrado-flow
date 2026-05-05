/**
 * Hook: pre-phase-gate
 * Blocks the Analyzer and Planner from editing source files.
 * Enforces phase boundary rules at the hook level.
 *
 * @opencode-ai/plugin
 */

export const name = "pre-phase-gate";
export const description = "Blocks read-only phases (Analyzer, Planner) from editing source files";

const READ_ONLY_AGENTS = ["analyzer", "planner"];
const PROTECTED_DIRS = ["src/", "lib/", "app/"];
const ALLOWED_WRITE_DIRS = [".agentic/memory/", ".agentic/output/"];

/**
 * Called before a file write operation.
 * If the current agent is read-only and the target is a source file,
 * blocks the write and returns an error.
 *
 * @param {object} event - { path, agent, phase }
 * @returns {object} - { proceed: boolean, error?: string }
 */
export function onFileWriteBefore(event) {
  const agent = (event.agent || "").toLowerCase();
  const phase = (event.phase || agent).toLowerCase();

  if (!READ_ONLY_AGENTS.includes(phase) && !READ_ONLY_AGENTS.includes(agent)) {
    return { proceed: true };
  }

  const isAllowedWrite = ALLOWED_WRITE_DIRS.some((dir) =>
    event.path.startsWith(dir)
  );

  if (isAllowedWrite) {
    return { proceed: true };
  }

  const isSourceFile = PROTECTED_DIRS.some((dir) =>
    event.path.startsWith(dir)
  );

  if (isSourceFile) {
    return {
      proceed: false,
      error: `PHASE BOUNDARY VIOLATION: Agent "${agent}" is read-only and cannot write to source file "${event.path}". Only writes to ${ALLOWED_WRITE_DIRS.join(", ")} are permitted.`,
    };
  }

  return { proceed: true };
}

/**
 * Called before a shell command execution.
 * If the current agent is read-only, blocks destructive commands.
 *
 * @param {object} event - { command, agent, phase }
 * @returns {object} - { proceed: boolean, error?: string }
 */
export function onBashBefore(event) {
  const agent = (event.agent || "").toLowerCase();
  const phase = (event.phase || agent).toLowerCase();

  if (!READ_ONLY_AGENTS.includes(phase) && !READ_ONLY_AGENTS.includes(agent)) {
    return { proceed: true };
  }

  const command = (event.command || "").trim();
  const destructivePatterns = [
    /\brm\s/,
    /\brmdir\s/,
    /\bdel\s/i,
    /\bmv\s/,
    /\bcp\s/,
    /\bgit\s+push/,
    /\bgit\s+commit/,
    /\bnpm\s+publish/,
    /\bdocker\s+rm/,
    /\bkill\s/,
  ];

  for (const pattern of destructivePatterns) {
    if (pattern.test(command)) {
      return {
        proceed: false,
        error: `PHASE BOUNDARY VIOLATION: Agent "${agent}" is read-only and cannot execute command "${command}".`,
      };
    }
  }

  return { proceed: true };
}
