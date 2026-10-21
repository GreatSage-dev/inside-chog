import fs from 'node:fs';
import path from 'node:path';

const dist = path.resolve('dist');
if (!fs.existsSync(dist)) {
  fs.mkdirSync(dist, { recursive: true });
}

const files = fs.readdirSync('.');
let copied = 0;
for (const file of files) {
  if (
    file === 'index.html' ||
    file.endsWith('.jpg') ||
    file.endsWith('.png') ||
    file.endsWith('.svg') ||
    file.endsWith('.ico')
  ) {
    fs.copyFileSync(file, path.join(dist, file));
    copied++;
  }
}

console.log(`[Inside Chog Build] Successfully bundled ${copied} static assets into ${dist}`);
