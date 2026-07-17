import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const out = path.join(root, "out");

if (!fs.existsSync(out)) {
  console.error("Missing out/ — run `next build` first.");
  process.exit(1);
}

const copyDirs = ["blog", "resume", "been", "PSK54", "images", "assets"];

for (const name of copyDirs) {
  const src = path.join(root, name);
  const dest = path.join(out, name);
  if (!fs.existsSync(src)) {
    console.warn(`Skip missing directory: ${name}`);
    continue;
  }
  fs.cpSync(src, dest, { recursive: true });
}

for (const file of ["favicon.ico", "README.md"]) {
  const src = path.join(root, file);
  const dest = path.join(out, file);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
  }
}

console.log("Staged static folders and files into out/ for GitHub Pages.");
