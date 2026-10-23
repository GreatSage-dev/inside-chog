import { launchChrome } from '../../motionmaxxing/scripts/_cdp.mjs';
import fs from 'node:fs';
import path from 'node:path';

(async () => {
  console.log('[Incidius Verification] Launching Chrome CDP...');
  const browser = await launchChrome();
  const page = await browser.newPage({ width: 1400, height: 900 });

  const consoleErrors = [];
  page.cdp.on('Runtime.consoleAPICalled', (params) => {
    if (params.type === 'error') {
      consoleErrors.push(params.args.map(a => a.value || a.description).join(' '));
    }
  });

  page.cdp.on('Runtime.exceptionThrown', (params) => {
    consoleErrors.push(params.exceptionDetails.text + ' ' + (params.exceptionDetails.exception?.description || ''));
  });

  console.log('[Incidius Verification] Navigating to http://localhost:3000 ...');
  await page.goto('http://localhost:3000');
  await new Promise(r => setTimeout(r, 1500));

  console.log('[Incidius Verification] Title:', await page.eval('document.title'));

  // 1. WAVE RUN WITH INCIDIUS RETRO PARALLAX & BLOCKS
  console.log('[Incidius Verification] Starting Wave Run...');
  await page.eval(`
    selectGameMode("wave");
    startRaidRun(false);
    for (let i = 0; i < 45; i++) {
      holdingInput = true;
      gameLoop(performance.now() + i * 16.6);
    }
  `);

  const waveDataUrl = await page.eval('document.getElementById("gameCanvas").toDataURL("image/png")');
  fs.writeFileSync(
    'c:/Users/HP LAPTOP/Documents/chug nft/motion_film/stills/incidius_wave_canvas.png',
    Buffer.from(waveDataUrl.split(',')[1], 'base64')
  );
  console.log('[Incidius Verification] Captured incidius_wave_canvas.png');

  // 2. HEIST RUN WITH INCIDIUS PLATFORM BEVELS & SIGHTREADING GUIDES
  console.log('[Incidius Verification] Starting Heist Run...');
  await page.eval(`
    selectGameMode("heist");
    startRaidRun(false);
    for (let i = 0; i < 35; i++) {
      gameLoop(performance.now() + i * 16.6);
    }
  `);

  const heistDataUrl = await page.eval('document.getElementById("gameCanvas").toDataURL("image/png")');
  fs.writeFileSync(
    'c:/Users/HP LAPTOP/Documents/chug nft/motion_film/stills/incidius_heist_canvas.png',
    Buffer.from(heistDataUrl.split(',')[1], 'base64')
  );
  console.log('[Incidius Verification] Captured incidius_heist_canvas.png');

  // 3. OVERDRIVE CLIMAX VAULT GUARDIAN BOSS ENCOUNTER
  console.log('[Incidius Verification] Testing Vault Guardian Boss Encounter at 78% progress...');
  await page.eval(`
    selectGameMode("wave");
    startRaidRun(false);
    wavePlayer.hasLaunched = true;
    wavePlayer.form = "wave";
    waveCameraX = (levelLengthPx - 260) * 0.78;
    const b = getWaveBoundsAt(waveCameraX + wavePlayer.x);
    wavePlayer.y = (b.top + b.bot) / 2;
    waveObstacles = []; // Clear obstacles for clean boss frame inspection
    waveMonsters = [];  // Clear monsters for clean boss frame inspection
    for (let i = 0; i < 5; i++) {
      gameLoop(performance.now() + i * 16.6);
    }
  `);

  const bossDataUrl = await page.eval('document.getElementById("gameCanvas").toDataURL("image/png")');
  fs.writeFileSync(
    'c:/Users/HP LAPTOP/Documents/chug nft/motion_film/stills/incidius_boss_canvas.png',
    Buffer.from(bossDataUrl.split(',')[1], 'base64')
  );
  console.log('[Incidius Verification] Captured incidius_boss_canvas.png');

  await browser.close();

  if (consoleErrors.length > 0) {
    console.error('[Incidius Verification] Encountered console errors:', consoleErrors);
    process.exit(1);
  } else {
    console.log('[Incidius Verification] SUCCESS! 0 console errors detected. All Incidius canvas layers captured.');
  }
})();
