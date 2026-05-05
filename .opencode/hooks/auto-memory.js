/**
 * Hook: auto-memory
 * Tracks writes to .agentic/memory/ for audit purposes.
 * Fires after every file write operation.
 *
 * @opencode-ai/plugin
 */

export const name = "auto-memory";
export const description = "Tracks writes to .agentic/memory/ for audit trail";

const MEMORY_DIR = ".agentic/memory/";
const AUDIT_LOG = ".agentic/memory/_audit.jsonl";

function timestamp() {
  return new Date().toISOString();
}

/**
 * Called after a file is written.
 * If the file is inside .agentic/memory/, logs the write event.
 *
 * @param {object} event - { path, content, agent }
 * @returns {object} - { proceed: true } (never blocks the write)
 */
export function onFileWrite(event) {
  if (!event.path.startsWith(MEMORY_DIR)) {
    return { proceed: true };
  }

  if (event.path === AUDIT_LOG) {
    return { proceed: true };
  }

  const entry = {
    timestamp: timestamp(),
    agent: event.agent || "unknown",
    action: "write",
    path: event.path,
    size_bytes: event.content ? event.content.length : 0,
  };

  const line = JSON.stringify(entry) + "\n";

  return {
    proceed: true,
    append: {
      path: AUDIT_LOG,
      content: line,
    },
  };
}

/**
 * Called after a file is deleted.
 * If the file was inside .agentic/memory/, logs the deletion.
 *
 * @param {object} event - { path, agent }
 * @returns {object} - { proceed: true }
 */
export function onFileDelete(event) {
  if (!event.path.startsWith(MEMORY_DIR)) {
    return { proceed: true };
  }

  if (event.path === AUDIT_LOG) {
    return { proceed: true };
  }

  const entry = {
    timestamp: timestamp(),
    agent: event.agent || "unknown",
    action: "delete",
    path: event.path,
  };

  const line = JSON.stringify(entry) + "\n";

  return {
    proceed: true,
    append: {
      path: AUDIT_LOG,
      content: line,
    },
  };
}
