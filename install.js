const fs = require("fs");
const path = require("path");

const targetDir = process.env.INIT_CWD || process.cwd();
const pkgDir = path.resolve(__dirname);

const dirs = [".agentic", ".opencode"];

for (const dir of dirs) {
  const src = path.join(pkgDir, dir);
  const dest = path.join(targetDir, dir);

  if (!fs.existsSync(src)) {
    console.log(`cerrado-flow: "${dir}/" nao encontrado no pacote, pulando...`);
    continue;
  }

  if (fs.existsSync(dest)) {
    console.log(`cerrado-flow: "${dir}/" ja existe no destino, pulando...`);
    continue;
  }

  copyDirSync(src, dest);
  console.log(`cerrado-flow: "${dir}/" copiado para ${targetDir}`);
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
