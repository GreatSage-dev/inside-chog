import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dist = path.resolve(__dirname, 'dist');
if (!fs.existsSync(dist)) {
  fs.mkdirSync(dist, { recursive: true });
}

const files = fs.readdirSync(__dirname);
let copied = 0;
for (const file of files) {
  if (
    file === 'index.html' ||
    file.endsWith('.jpg') ||
    file.endsWith('.png') ||
    file.endsWith('.svg') ||
    file.endsWith('.ico')
  ) {
    fs.copyFileSync(path.join(__dirname, file), path.join(dist, file));
    copied++;
  }
}

console.log(`[Inside Chog Build] Successfully bundled ${copied} static assets into ${dist}`);
