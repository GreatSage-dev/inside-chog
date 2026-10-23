import { launchChrome } from '../../motionmaxxing/scripts/_cdp.mjs';
import fs from 'node:fs';

(async () => {
  const browser = await launchChrome({ width: 1400, height: 900 });
  const page = await browser.newPage({ width: 1400, height: 900 });
  await page.goto('http://localhost:3000');
  await new Promise(r => setTimeout(r, 1200));

  const outDir = 'C:/Users/HP LAPTOP/.gemini/antigravity/brain/37a9bf25-0d13-4d9c-bb11-5142d958d0dc';

  // 1. Home Hero
  const shot1 = await page.shot({ format: 'png' });
  fs.writeFileSync(`${outDir}/audit_home_hero.png`, shot1);

  // 2. Cartridges
  await page.eval('document.getElementById("cartridges").scrollIntoView()');
  await new Promise(r => setTimeout(r, 500));
  const shot2 = await page.shot({ format: 'png' });
  fs.writeFileSync(`${outDir}/audit_cartridges.png`, shot2);

  // 3. Compiler / Architecture
  await page.eval('document.getElementById("architecture").scrollIntoView()');
  await new Promise(r => setTimeout(r, 500));
  const shot3 = await page.shot({ format: 'png' });
  fs.writeFileSync(`${outDir}/audit_compiler.png`, shot3);

  // 4. Load Bearing Killswitch
  await page.eval('document.getElementById("loadbearing").scrollIntoView()');
  await new Promise(r => setTimeout(r, 500));
  const shot4 = await page.shot({ format: 'png' });
  fs.writeFileSync(`${outDir}/audit_killswitch.png`, shot4);

  // 5. Hall of Fame Leaderboard
  await page.eval('document.getElementById("halloffame").scrollIntoView()');
  await new Promise(r => setTimeout(r, 500));
  const shot5 = await page.shot({ format: 'png' });
  fs.writeFileSync(`${outDir}/audit_leaderboard.png`, shot5);

  // 6. Arena Modal
  await page.eval(`(() => {
    openArenaWithCurrent();
  })()`);
  await new Promise(r => setTimeout(r, 600));
  const shot6 = await page.shot({ format: 'png' });
  fs.writeFileSync(`${outDir}/audit_arena_modal.png`, shot6);

  await browser.close();
  console.log('AUDIT_COMPLETE');
})();
