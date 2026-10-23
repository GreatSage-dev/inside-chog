import fs from 'node:fs';
import path from 'node:path';
import { launchChrome } from '../../motionmaxxing/scripts/_cdp.mjs';

const ASSETS_DIR = path.resolve('c:/Users/HP LAPTOP/Documents/chug nft/motion_film/assets');
if (!fs.existsSync(ASSETS_DIR)) fs.mkdirSync(ASSETS_DIR, { recursive: true });

async function captureAll() {
  console.log('Launching Chrome via CDP...');
  const br = await launchChrome({ width: 1920, height: 1080 });
  const page = await br.newPage({ width: 1920, height: 1080, scale: 1 });

  console.log('Navigating to http://localhost:3000 ...');
  await page.goto('http://localhost:3000');
  await page.eval('(() => new Promise(r => setTimeout(r, 1200)))()');

  // 1. Scene 1 - Hero
  console.log('Capturing Scene 1 (Hero)...');
  await page.eval('window.scrollTo(0, 0)');
  const s1 = await page.shot({ format: 'png' });
  fs.writeFileSync(path.join(ASSETS_DIR, 'scene1_hero.png'), s1);

  // 2. Scene 2 - Compiler
  console.log('Capturing Scene 2 (ROM Compiler)...');
  await page.eval('window.scrollTo(0, 720)');
  await page.eval('(() => new Promise(r => setTimeout(r, 400)))()');
  const s2 = await page.shot({ format: 'png' });
  fs.writeFileSync(path.join(ASSETS_DIR, 'scene2_compiler.png'), s2);

  // 3. Scene 3 - Gameplay Modal
  console.log('Capturing Scene 3 (Gameplay)...');
  await page.eval('window.scrollTo(0, 0)');
  await page.eval('(() => { const b = Array.from(document.querySelectorAll("button")).find(x => x.innerText.includes("Launch Instant Heist")); if (b) b.click(); })()');
  await page.eval('(() => new Promise(r => setTimeout(r, 800)))()');
  const s3 = await page.shot({ format: 'png' });
  fs.writeFileSync(path.join(ASSETS_DIR, 'scene3_gameplay.png'), s3);

  // Close modal
  await page.eval('(() => { const b = Array.from(document.querySelectorAll("button")).find(x => x.innerText.includes("Back to Dossier")); if (b) b.click(); })()');
  await page.eval('(() => new Promise(r => setTimeout(r, 400)))()');

  // 4. Scene 4 - 40/50/10 Split
  console.log('Capturing Scene 4 (40/50/10 Split)...');
  await page.eval('window.scrollTo(0, 2900)');
  await page.eval('(() => new Promise(r => setTimeout(r, 400)))()');
  const s4 = await page.shot({ format: 'png' });
  fs.writeFileSync(path.join(ASSETS_DIR, 'scene4_revenue.png'), s4);

  // 5. Scene 5 - Ablation Test
  console.log('Capturing Scene 5 (Ablation Test)...');
  await page.eval('window.scrollTo(0, 4750)');
  await page.eval('(() => new Promise(r => setTimeout(r, 400)))()');
  const s5 = await page.shot({ format: 'png' });
  fs.writeFileSync(path.join(ASSETS_DIR, 'scene5_ablation.png'), s5);

  // 6. Scene 6 - On-Chain Receipts
  console.log('Capturing Scene 6 (On-Chain Receipts)...');
  await page.eval('window.scrollTo(0, 6700)');
  await page.eval('(() => new Promise(r => setTimeout(r, 400)))()');
  const s6 = await page.shot({ format: 'png' });
  fs.writeFileSync(path.join(ASSETS_DIR, 'scene6_outro.png'), s6);

  await br.close();
  console.log('ALL 6 HIGH-RES SCENE STILLS CAPTURED CLEANLY!');
}

captureAll().catch(err => {
  console.error('Capture error:', err);
  process.exit(1);
});
