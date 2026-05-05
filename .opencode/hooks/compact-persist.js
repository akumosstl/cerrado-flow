/**
 * Hook: compact-persist
 * During context compaction, replaces verbose agent output with
 * memory file references so the context window stays small while
 * artifacts remain accessible on disk.
 *
 * @opencode-ai/plugin
 */

import fs from "fs";
import path from "path";

export const name = "compact-persist";
export const description = "Replaces verbose context with memory file references during compaction";

const MEMORY_DIR = ".agentic/memory/";

function getMemoryArtifacts() {
  try {
    const files = fs.readdirSync(MEMORY_DIR);
    return files
      .filter(file => file.endsWith(".json"))
      .map(file => path.join(MEMORY_DIR, file));
  } catch (err) {
    return [];
  }
}

/**
 * Called during context compaction.
 * Replaces full artifact content with a compact reference.
 *
 * @param {object} event - { messages: Array, tokenCount: number }
 * @returns {object} - { messages: Array } (modified messages)
 */
export function onCompact(event) {
  if (!event.messages || !Array.isArray(event.messages)) {
    return { messages: event.messages };
  }

  const compacted = event.messages.map((msg) => {
    if (msg.role !== "assistant" || !msg.content) {
      return msg;
    }

    let content = msg.content;
    const memoryArtifacts = getMemoryArtifacts();

    for (const artifactPath of memoryArtifacts) {
      const reference = `[Artifact: ${artifactPath}]`;
      if (content.includes(artifactPath)) {
        const artifactPattern = new RegExp(
          `(Writing|Wrote|Output at) ${escapeRegex(artifactPath)}[^\n]*\n[\s\S]*?(?=\n[A-Z\[]|$)`,
          "g"
        );
        content = content.replace(artifactPattern, reference);
      }
    }

    return { ...msg, content };
  });

  return { messages: compacted };
}

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
