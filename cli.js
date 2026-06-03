#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const targetDir = process.cwd();
const pkgDir = path.resolve(__dirname, ".");

const dirs = [".agentic", ".opencode"];
const force = process.argv.includes("--force");

for (const dir of dirs) {
  const src = path.join(pkgDir, dir);
  const dest = path.join(targetDir, dir);

  if (!fs.existsSync(src)) {
    console.error(`Fonte "${dir}/" nao encontrada no pacote.`);
    process.exit(1);
  }

  if (fs.existsSync(dest)) {
    if (force) {
      fs.rmSync(dest, { recursive: true, force: true });
    } else {
      console.log(`"${dir}/" ja existe. Use --force para sobrescrever.`);
      continue;
    }
  }

  copyDirSync(src, dest);
  console.log(`ok: "${dir}/" copiado para ${targetDir}`);
}

function copyDirSync(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDirSync(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}
