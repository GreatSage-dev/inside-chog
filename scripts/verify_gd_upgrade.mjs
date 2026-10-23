import { launchChrome } from '../../motionmaxxing/scripts/_cdp.mjs';
import fs from 'node:fs';

(async () => {
  const browser = await launchChrome({ width: 1400, height: 900 });
  const page = await browser.newPage({ width: 1400, height: 900 });
  await page.goto('http://localhost:3000');
  await new Promise(r => setTimeout(r, 1200));

  // 1. Click Launch Instant Heist (opens wave mode directly)
  await page.eval(`(() => {
    const b = Array.from(document.querySelectorAll("button")).find(x => x.innerText.includes("Launch Instant Heist"));
    if (b) b.click();
  })()`);
  await new Promise(r => setTimeout(r, 300));

  // Capture canvas before launch (waiting for player)
  const waitingCanvas = await page.eval('document.getElementById("gameCanvas").toDataURL("image/png")');
  fs.writeFileSync('c:/Users/HP LAPTOP/Documents/chug nft/motion_film/stills/gd_waiting_canvas.png', Buffer.from(waitingCanvas.split(',')[1], 'base64'));

  // 2. Launch & run 45 frames (Cube running forward towards the jump)
  await page.eval(`(() => {
    handlePressStart();
    handlePressEnd();
    for (let f = 0; f < 45; f++) {
      gameLoop(performance.now() + f * 16.6);
    }
  })()`);

  const activeCanvas = await page.eval('document.getElementById("gameCanvas").toDataURL("image/png")');
  fs.writeFileSync('c:/Users/HP LAPTOP/Documents/chug nft/motion_film/stills/gd_running_canvas.png', Buffer.from(activeCanvas.split(',')[1], 'base64'));

  // 3. Full window screenshot
  const fullShot = await page.shot({ format: 'png' });
  fs.writeFileSync('c:/Users/HP LAPTOP/Documents/chug nft/motion_film/stills/gd_full_screen.png', fullShot);

  await browser.close();
  console.log('UPGRADED GD GAMEPLAY CAPTURED CLEANLY!');
})();
