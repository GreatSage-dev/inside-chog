import { launchChrome } from '../../motionmaxxing/scripts/_cdp.mjs';
import fs from 'node:fs';

(async () => {
  const browser = await launchChrome({ width: 1400, height: 900 });
  const page = await browser.newPage({ width: 1400, height: 900 });
  await page.goto('http://localhost:3000');
  await new Promise(r => setTimeout(r, 1000));

  // 1. Initial page view
  const shot0 = await page.shot({ format: 'png' });
  fs.writeFileSync('c:/Users/HP LAPTOP/Documents/chug nft/motion_film/stills/user_landing.png', shot0);

  // 2. Click Launch Instant Heist
  await page.eval(`(() => {
    const b = Array.from(document.querySelectorAll("button")).find(x => x.innerText.includes("Launch Instant Heist"));
    if (b) b.click();
  })()`);
  await new Promise(r => setTimeout(r, 800));
  const shot1 = await page.shot({ format: 'png' });
  fs.writeFileSync('c:/Users/HP LAPTOP/Documents/chug nft/motion_film/stills/user_heist_modal.png', shot1);

  // 3. Switch to Wave
  await page.eval(`(() => {
    const b = document.getElementById("switchGameBtn");
    if (b) b.click();
  })()`);
  await new Promise(r => setTimeout(r, 800));
  const shot2 = await page.shot({ format: 'png' });
  fs.writeFileSync('c:/Users/HP LAPTOP/Documents/chug nft/motion_film/stills/user_wave_modal.png', shot2);

  await browser.close();
  console.log('ALL THREE USER VIEWS CAPTURED!');
})();
