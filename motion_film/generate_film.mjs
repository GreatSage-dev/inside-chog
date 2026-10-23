import fs from 'node:fs';
import path from 'node:path';

const manifest = JSON.parse(fs.readFileSync('c:/Users/HP LAPTOP/Documents/chug nft/video/src/vo-manifest.json', 'utf8'));

const sceneOffsets = {
  hook: 0,
  revenue: 16.5,
  wave: 34.0,
  social: 53.5,
  ablation: 69.5,
  outro: 86.5
};

// Flatten words into global timeline
const allWords = [];
for (const [sceneId, data] of Object.entries(manifest)) {
  const offset = sceneOffsets[sceneId] ?? 0;
  for (const w of data.words) {
    allWords.push({
      text: w.text,
      start: Number((w.start + offset).toFixed(3)),
      end: Number((w.end + offset).toFixed(3)),
      scene: sceneId
    });
  }
}

// Group words into phrases (chunks of ~5-8 words, or punctuated breaks)
const phrases = [];
let currentPhrase = { words: [], start: 0, end: 0, text: '' };

for (let i = 0; i < allWords.length; i++) {
  const w = allWords[i];
  if (currentPhrase.words.length === 0) {
    currentPhrase.start = w.start;
  }
  currentPhrase.words.push(w);
  currentPhrase.end = w.end;
  currentPhrase.text += (currentPhrase.text ? ' ' : '') + w.text;

  const endsWithPunct = /[.,?!]$/.test(w.text);
  const isTooLong = currentPhrase.words.length >= 7;
  const nextIsFar = allWords[i + 1] && (allWords[i + 1].start - w.end > 0.4);

  if (endsWithPunct || isTooLong || nextIsFar || i === allWords.length - 1) {
    phrases.push({ ...currentPhrase });
    currentPhrase = { words: [], start: 0, end: 0, text: '' };
  }
}

console.log(`Generated ${allWords.length} global words across ${phrases.length} subtitle phrases.`);

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>INSIDE CHOG · Full Judge Demo (Motionmaxxing)</title>
<meta name="viewport" content="width=1920, height=1080">
<link rel="stylesheet" href="./runtime/fonts.css">
<style>
:root {
  --bg: #22000a;
  --surface: #360012;
  --surface-raised: #4d031b;
  --ink: #fff0f7;
  --ink-muted: #f29bcb;
  --accent: #ff99d3;
  --gold: #ffd166;
  --acid: #b8ff65;
  --danger: #ff4d6d;
  --font: "Inter", system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
}
* { box-sizing: border-box; margin: 0; padding: 0; }
html, body {
  margin: 0;
  width: 1920px;
  height: 1080px;
  overflow: hidden;
  background: #000;
  font-family: var(--font);
  color: var(--ink);
  -webkit-font-smoothing: antialiased;
}
#main {
  position: absolute;
  left: 0;
  top: 0;
  width: 1920px;
  height: 1080px;
  overflow: hidden;
  background: radial-gradient(circle at 50% 30%, #4a0319 0%, #1e0008 70%, #100004 100%);
}

/* Atmospheric grid background */
.grid-bg {
  position: absolute;
  inset: 0;
  background-image: 
    linear-gradient(to right, rgba(255, 153, 211, 0.06) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(255, 153, 211, 0.06) 1px, transparent 1px);
  background-size: 54px 54px;
  pointer-events: none;
}

/* Atmospheric Glow Orbs */
.glow-orb-1 {
  position: absolute;
  top: -150px;
  right: -100px;
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, rgba(255, 153, 211, 0.15) 0%, transparent 70%);
  filter: blur(80px);
  pointer-events: none;
}
.glow-orb-2 {
  position: absolute;
  bottom: -150px;
  left: -100px;
  width: 700px;
  height: 700px;
  background: radial-gradient(circle, rgba(184, 255, 101, 0.08) 0%, transparent 70%);
  filter: blur(90px);
  pointer-events: none;
}

/* Header Telemetry */
.header-bar {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 76px;
  padding: 0 54px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid rgba(255, 153, 211, 0.2);
  background: rgba(30, 0, 9, 0.9);
  backdrop-filter: blur(20px);
  z-index: 100;
}
.header-left {
  display: flex;
  align-items: center;
  gap: 18px;
}
.brand-mark {
  background: var(--ink);
  color: #22000a;
  font-weight: 900;
  font-size: 14px;
  letter-spacing: 0.12em;
  padding: 5px 10px;
  clip-path: polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 0 100%);
}
.brand-title {
  font-weight: 800;
  font-size: 22px;
  letter-spacing: -0.02em;
  color: #fff;
}
.badge-pill {
  font-family: monospace;
  font-size: 13px;
  padding: 5px 14px;
  border-radius: 4px;
  letter-spacing: 0.06em;
  border: 1px solid rgba(255, 153, 211, 0.35);
  background: rgba(255, 153, 211, 0.08);
  color: var(--ink-muted);
}
.badge-pill.active {
  border-color: var(--acid);
  color: var(--acid);
  background: rgba(184, 255, 101, 0.12);
}
.stage-indicator {
  font-family: monospace;
  font-size: 14px;
  font-weight: 800;
  color: var(--gold);
  letter-spacing: 0.1em;
}

/* Scene Container - Visibility purely managed by motion.js (NO display:none, NO opacity:0) */
.scene {
  position: absolute;
  inset: 0;
  padding-top: 76px;
  padding-bottom: 124px;
  box-sizing: border-box;
}

/* Scene 1: Hook */
#s1 .content-grid {
  display: grid;
  grid-template-columns: 1.15fr 0.95fr;
  height: 100%;
  padding: 50px 80px;
  gap: 60px;
  align-items: center;
}
.hook-headline {
  font-size: 80px;
  font-weight: 900;
  line-height: 0.95;
  letter-spacing: -0.04em;
  text-transform: uppercase;
  color: #fff;
}
.hook-headline span {
  color: var(--accent);
  text-shadow: 0 0 30px rgba(255, 153, 211, 0.4);
}
.hook-subhead {
  font-size: 24px;
  line-height: 1.45;
  color: var(--ink-muted);
  margin-top: 24px;
  max-width: 680px;
}
.hook-metrics {
  display: flex;
  gap: 20px;
  margin-top: 36px;
}
.metric-box {
  background: rgba(255, 153, 211, 0.08);
  border: 1px solid rgba(255, 153, 211, 0.25);
  padding: 16px 22px;
  clip-path: polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 0 100%);
}
.metric-val {
  font-size: 34px;
  font-weight: 900;
  font-family: monospace;
  color: var(--gold);
}
.metric-label {
  font-size: 13px;
  color: var(--ink-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-top: 4px;
}
.hook-visual {
  position: relative;
  perspective: 1200px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.hero-card {
  width: 600px;
  border-radius: 14px;
  border: 2px solid rgba(255, 153, 211, 0.35);
  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.85), 0 0 60px rgba(255, 153, 211, 0.25);
  transform: rotateY(-6deg) rotateX(3deg);
  overflow: hidden;
}

/* Scene 2: ROM Compiler */
#s2 .compiler-stage {
  padding: 40px 80px;
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  gap: 48px;
  height: 100%;
  align-items: center;
}
.ui-panel {
  background: rgba(30, 0, 10, 0.85);
  border: 1px solid rgba(255, 153, 211, 0.25);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 24px 70px rgba(0,0,0,0.7);
}
.ui-panel img {
  width: 100%;
  height: auto;
  display: block;
}
.specs-card {
  background: rgba(45, 2, 16, 0.75);
  border: 1px solid rgba(255, 153, 211, 0.3);
  padding: 38px;
  border-radius: 10px;
  clip-path: polygon(0 0, calc(100% - 22px) 0, 100% 22px, 100% 100%, 0 100%);
  box-shadow: 0 20px 60px rgba(0,0,0,0.6);
}
.spec-title {
  font-size: 38px;
  font-weight: 900;
  color: #fff;
  letter-spacing: -0.02em;
  line-height: 1.15;
  margin-bottom: 20px;
}
.spec-row {
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid rgba(255, 153, 211, 0.14);
  font-family: monospace;
  font-size: 16px;
}
.spec-key { color: var(--ink-muted); }
.spec-val { color: var(--gold); font-weight: 700; }
.spec-val.acid { color: var(--acid); font-weight: 800; text-shadow: 0 0 12px rgba(184, 255, 101, 0.5); }

/* Scene 3: Gameplay Arcade */
#s3 .gameplay-stage {
  padding: 24px 80px;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.arcade-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 16px;
}
.arcade-title {
  font-size: 36px;
  font-weight: 900;
  color: #fff;
}
.arcade-frame {
  width: 100%;
  height: 640px;
  border: 2px solid rgba(255, 153, 211, 0.45);
  border-radius: 14px;
  overflow: hidden;
  position: relative;
  box-shadow: 0 30px 90px rgba(0,0,0,0.85), 0 0 80px rgba(184, 255, 101, 0.2);
}
.arcade-frame img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}
.arcade-overlay-badge {
  position: absolute;
  top: 24px;
  right: 24px;
  background: rgba(0, 0, 0, 0.88);
  border: 1px solid var(--acid);
  color: var(--acid);
  font-family: monospace;
  font-size: 15px;
  padding: 8px 18px;
  font-weight: 800;
  border-radius: 4px;
  box-shadow: 0 0 20px rgba(184, 255, 101, 0.3);
}

/* Scene 4: Revenue Split */
#s4 .revenue-stage {
  padding: 40px 80px;
  height: 100%;
  display: grid;
  grid-template-columns: 1.05fr 0.95fr;
  gap: 50px;
  align-items: center;
}
.split-cards {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.split-bar {
  background: rgba(255, 153, 211, 0.06);
  border: 1px solid rgba(255, 153, 211, 0.25);
  padding: 22px 26px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  clip-path: polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 0 100%);
}
.split-bar.gold { border-left: 8px solid var(--gold); }
.split-bar.accent { border-left: 8px solid var(--accent); }
.split-bar.danger { border-left: 8px solid var(--danger); }
.split-pct {
  font-size: 40px;
  font-weight: 900;
  font-family: monospace;
  color: #fff;
  width: 105px;
}
.split-desc {
  flex: 1;
  padding: 0 20px;
}
.split-desc h4 { font-size: 20px; color: #fff; font-weight: 800; }
.split-desc p { font-size: 14px; color: var(--ink-muted); margin-top: 3px; }
.split-amt {
  font-family: monospace;
  font-size: 22px;
  font-weight: 800;
  color: var(--gold);
}

/* Scene 5: Ablation */
#s5 .ablation-stage {
  padding: 30px 80px;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.alert-banner {
  background: rgba(255, 77, 109, 0.2);
  border: 2px solid var(--danger);
  padding: 18px 28px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 22px;
  clip-path: polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 0 100%);
  box-shadow: 0 0 40px rgba(255, 77, 109, 0.3);
}
.alert-banner-text {
  font-family: monospace;
  font-weight: 900;
  font-size: 17px;
  color: #fff;
  letter-spacing: 0.06em;
}

/* Scene 6: Outro */
#s6 .outro-stage {
  padding: 40px 80px;
  height: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 50px;
  align-items: center;
}
.cta-box {
  background: rgba(255, 153, 211, 0.06);
  border: 1px solid rgba(255, 153, 211, 0.35);
  padding: 48px;
  clip-path: polygon(0 0, calc(100% - 24px) 0, 100% 24px, 100% 100%, 0 100%);
}
.cta-title {
  font-size: 54px;
  font-weight: 900;
  line-height: 1.05;
  color: #fff;
  margin-bottom: 24px;
}
.cta-link {
  display: inline-block;
  background: var(--ink);
  color: #22000a;
  font-size: 20px;
  font-weight: 900;
  padding: 16px 36px;
  text-decoration: none;
  clip-path: polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 0 100%);
  margin-top: 28px;
  letter-spacing: 0.04em;
  box-shadow: 0 10px 30px rgba(255, 153, 211, 0.4);
}

/* Frosted Glass Karaoke Subtitles */
.caption-bar {
  position: absolute;
  bottom: 34px;
  left: 50%;
  transform: translateX(-50%);
  width: 1440px;
  padding: 16px 40px;
  background: rgba(18, 0, 6, 0.88);
  backdrop-filter: blur(24px);
  border: 1px solid rgba(255, 153, 211, 0.3);
  border-radius: 9999px;
  box-shadow: 0 16px 50px rgba(0, 0, 0, 0.8), 0 0 30px rgba(255, 153, 211, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  z-index: 200;
  min-height: 70px;
}
.caption-text {
  font-size: 23px;
  font-weight: 600;
  line-height: 1.35;
  color: rgba(255, 255, 255, 0.65);
}
.caption-text .word {
  display: inline-block;
  margin: 0 4px;
  transition: color 0.1s ease, transform 0.1s ease;
}
.caption-text .word.active {
  color: var(--gold);
  font-weight: 900;
  transform: scale(1.1);
  text-shadow: 0 0 20px rgba(255, 209, 102, 0.8);
}
.caption-text .word.past {
  color: #ffffff;
}
</style>
</head>
<body>
<div id="main">
  <div class="grid-bg"></div>
  <div class="glow-orb-1"></div>
  <div class="glow-orb-2"></div>

  <!-- Header Telemetry -->
  <header class="header-bar">
    <div class="header-left">
      <div class="brand-mark">CHOG-OS</div>
      <div class="brand-title">INSIDE CHOG</div>
      <div class="badge-pill active">● MONAD TESTNET 10143</div>
    </div>
    <div id="stage-badge" class="stage-indicator">STAGE 1 · THE HIGH-STAKES HOOK</div>
    <div class="badge-pill">CONTRACT 0x6D8d...8c36</div>
  </header>

  <!-- SCENE 1: HOOK (0s - 16.5s) -->
  <section id="s1" class="scene">
    <div class="content-grid">
      <div class="hook-info">
        <h1 class="hook-headline">Dead JPEGs<br><span>Now Bleed.</span></h1>
        <p class="hook-subhead">Inside Chog compiles dormant Chog NFTs on Monad into executable 60FPS arcade vaults and cash-flowing automated landlords.</p>
        <div class="hook-metrics">
          <div class="metric-box">
            <div class="metric-val">95%</div>
            <div class="metric-label">NFTs Earning $0</div>
          </div>
          <div class="metric-box">
            <div class="metric-val">0.05 MON</div>
            <div class="metric-label">Raid Entry Toll</div>
          </div>
          <div class="metric-box">
            <div class="metric-val">40%</div>
            <div class="metric-label">Landlord Revenue</div>
          </div>
        </div>
      </div>
      <div class="hook-visual">
        <div class="hero-card" id="hero-card">
          <img src="./assets/scene1_hero.png" style="width:100%; display:block;" alt="Inside Chog Hero">
        </div>
      </div>
    </div>
  </section>

  <!-- SCENE 2: ROM COMPILER (16.5s - 34.0s) -->
  <section id="s2" class="scene">
    <div class="compiler-stage">
      <div class="ui-panel" id="compiler-panel">
        <img src="./assets/scene2_compiler.png" alt="ROM Compiler">
      </div>
      <div class="specs-card" id="specs-card">
        <h2 class="spec-title">Deterministic Trait Compilation</h2>
        <div class="spec-row"><span class="spec-key">TOKEN ID</span><span class="spec-val">#402 (ARCADE STRIKER)</span></div>
        <div class="spec-row"><span class="spec-key">BYTECODE HASH</span><span class="spec-val">0xac300c01b9...</span></div>
        <div class="spec-row"><span class="spec-key">CLEAR-CHECK SOLVER</span><span class="spec-val acid">PASS (0.4ms)</span></div>
        <div class="spec-row"><span class="spec-key">HAZARD GENOME</span><span class="spec-val">STEPPING STONES + LASERS</span></div>
        <div class="spec-row"><span class="spec-key">BOUNTY POOL</span><span class="spec-val">14.80 MON</span></div>
        <div class="spec-row"><span class="spec-key">LANDLORD OWNER</span><span class="spec-val">0x71C4...89A2</span></div>
      </div>
    </div>
  </section>

  <!-- SCENE 3: GAMEPLAY ARCADE (34.0s - 53.5s) -->
  <section id="s3" class="scene">
    <div class="gameplay-stage">
      <div class="arcade-header">
        <h2 class="arcade-title">Incidius Geometry Dash Engine · 240 TPS Wave &amp; Boss Gauntlet</h2>
        <div class="badge-pill active">240 TPS FIXED SUB-STEPPING · ZERO INPUT LAG</div>
      </div>
      <div class="arcade-frame" id="arcade-frame">
        <img id="arcade-img-wave" src="./assets/incidius_wave.png" alt="Incidius Wave Engine" style="position:absolute; inset:0; width:100%; height:100%; object-fit:cover;">
        <img id="arcade-img-boss" src="./assets/incidius_boss.png" alt="Incidius Boss Climax" style="position:absolute; inset:0; width:100%; height:100%; object-fit:cover; opacity:0;">
        <div id="arcade-badge" class="arcade-overlay-badge">INCIDIUS 2.2 WAVE CORRIDOR · 240 TPS</div>
      </div>
    </div>
  </section>

  <!-- SCENE 4: 40/50/10 REVENUE (53.5s - 69.5s) -->
  <section id="s4" class="scene">
    <div class="revenue-stage">
      <div class="split-cards" id="split-cards">
        <div class="split-bar gold">
          <div class="split-pct">40%</div>
          <div class="split-desc">
            <h4>Landlord Yield</h4>
            <p>Routes instantly on-chain to verified ownerOf(tokenId)</p>
          </div>
          <div class="split-amt">+0.02 MON</div>
        </div>
        <div class="split-bar accent">
          <div class="split-pct">50%</div>
          <div class="split-desc">
            <h4>Jackpot Bounty Pool</h4>
            <p>Swells vault treasury for successful 100% penetrators</p>
          </div>
          <div class="split-amt">+0.025 MON</div>
        </div>
        <div class="split-bar danger">
          <div class="split-pct">10%</div>
          <div class="split-desc">
            <h4>Deflationary Burn</h4>
            <p>Permanent burn sink sent directly to 0x0...dEaD</p>
          </div>
          <div class="split-amt">+0.005 MON</div>
        </div>
      </div>
      <div class="ui-panel" id="revenue-ui">
        <img src="./assets/scene4_revenue.png" alt="Revenue Model">
      </div>
    </div>
  </section>

  <!-- SCENE 5: ABLATION (69.5s - 86.5s) -->
  <section id="s5" class="scene">
    <div class="ablation-stage">
      <div class="alert-banner" id="ablation-banner">
        <div class="alert-banner-text">CRITICAL ARCHITECTURAL ABLATION: CHOG NFT REMOVED FROM RUNTIME</div>
        <div class="badge-pill" style="border-color:var(--danger); color:var(--danger); background:rgba(255,77,109,0.2);">ERR_EMPTY_CARTRIDGE · HALTED</div>
      </div>
      <div class="ui-panel" id="ablation-ui" style="border-color: rgba(255,77,109,0.6);">
        <img src="./assets/scene5_ablation.png" alt="Ablation Proof">
      </div>
    </div>
  </section>

  <!-- SCENE 6: OUTRO (86.5s - 103.0s) -->
  <section id="s6" class="scene">
    <div class="outro-stage">
      <div class="cta-box" id="cta-box">
        <h2 class="cta-title">Live on Monad Testnet.<br>Raid the Vaults.</h2>
        <div class="spec-row"><span class="spec-key">NETWORK</span><span class="spec-val acid">MONAD TESTNET (CHAIN ID 10143)</span></div>
        <div class="spec-row"><span class="spec-key">VERIFIED CONTRACT</span><span class="spec-val">0x6D8d...8c36</span></div>
        <div class="spec-row"><span class="spec-key">DEPLOYER BALANCE</span><span class="spec-val" style="color:var(--gold)">4.7603 MON</span></div>
        <a class="cta-link" href="https://inside-chog.vercel.app">inside-chog.vercel.app</a>
      </div>
      <div class="ui-panel" id="outro-ui">
        <img src="./assets/scene6_outro.png" alt="Verified Receipts">
      </div>
    </div>
  </section>

  <!-- Frosted Glass Karaoke Subtitles -->
  <div class="caption-bar">
    <div id="caption-text" class="caption-text">Welcome to Inside Chog.</div>
  </div>
</div>

<script src="./runtime/vendor/gsap.min.js"></script>
<script src="./runtime/motion.js"></script>
<script>
const M = Motion.film({ fps: 30, duration: 103, width: 1920, height: 1080 });

const phrases = ${JSON.stringify(phrases)};

const scenes = [
  { id: 's1', start: 0, end: 16.5, stage: 'STAGE 1 · THE HIGH-STAKES HOOK' },
  { id: 's2', start: 16.5, end: 34.0, stage: 'STAGE 2 · DETERMINISTIC ROM COMPILER' },
  { id: 's3', start: 34.0, end: 53.5, stage: 'STAGE 3 · 240 TPS ARCADE GAMEPLAY' },
  { id: 's4', start: 53.5, end: 69.5, stage: 'STAGE 4 · 40/50/10 REVENUE ENGINE' },
  { id: 's5', start: 69.5, end: 86.5, stage: 'STAGE 5 · LOAD-BEARING ABLATION PROOF' },
  { id: 's6', start: 86.5, end: 103.0, stage: 'STAGE 6 · VERIFIED MONAD TESTNET RECEIPTS' }
];

const stageBadge = document.getElementById('stage-badge');
const captionContainer = document.getElementById('caption-text');

// Scene cut transitions (Frame-accurate hard cuts)
scenes.forEach((sc, i) => {
  const f = Math.round(sc.start * 30);
  const hideOthers = scenes.filter((_, idx) => idx !== i).map(x => '#' + x.id);
  M.cut(f, { hide: hideOthers, show: ['#' + sc.id] });
});

// Scene 1: Card 3D entrance and drift
M.enter('#hero-card', { at: 2, frames: 16, from: { y: 60, scale: 0.9, opacity: 0 } });
M.kf('#hero-card', 'scale', [[2, 0.9], [250, 1.0], [490, 1.03, 'glide']]);

// Scene 2: Compiler panel snap
M.enter('#compiler-panel', { at: 500, frames: 14, from: { x: -80, opacity: 0 } });
M.enter('#specs-card', { at: 508, frames: 16, from: { x: 80, opacity: 0 } });

// Scene 3: Arcade frame entry and zoom
M.enter('#arcade-frame', { at: 1025, frames: 16, from: { scale: 0.94, opacity: 0 } });
M.kf('#arcade-frame', 'scale', [[1025, 0.94], [1300, 1.0], [1600, 1.02, 'glide']]);

// Scene 4: Split cards cascading entry
M.enter('#split-cards', { at: 1610, frames: 15, from: { y: 40, opacity: 0 } });
M.enter('#revenue-ui', { at: 1618, frames: 15, from: { scale: 0.95, opacity: 0 } });

// Scene 5: Ablation alert pulse
M.enter('#ablation-banner', { at: 2090, frames: 12, from: { y: -30, opacity: 0 } });
M.enter('#ablation-ui', { at: 2098, frames: 16, from: { scale: 0.96, opacity: 0 } });

// Scene 6: Outro cta entry
M.enter('#cta-box', { at: 2600, frames: 16, from: { x: -60, opacity: 0 } });
M.enter('#outro-ui', { at: 2608, frames: 16, from: { x: 60, opacity: 0 } });

// WRAP window.__seek SO MOTION'S INTERNAL TIMELINE AND CLOCK RUN DETERMINISTICALLY
const motionSeek = window.__seek;
window.__seek = (t) => {
  // 1. Run Motion.js internal seek (GSAP tweens, visibility ops, renders)
  if (typeof motionSeek === 'function') {
    motionSeek(t);
  }

  // 2. Update stage telemetry badge
  const activeScene = scenes.find(s => t >= s.start && t < s.end) || scenes[scenes.length - 1];
  if (activeScene && stageBadge.innerText !== activeScene.stage) {
    stageBadge.innerText = activeScene.stage;
  }

  // 2b. Update Arcade Stage sub-modes (Incidius Wave vs 256 BPM Boss Climax)
  const waveImg = document.getElementById('arcade-img-wave');
  const bossImg = document.getElementById('arcade-img-boss');
  const arcadeBadge = document.getElementById('arcade-badge');
  if (waveImg && bossImg && arcadeBadge) {
    if (t >= 44.0 && t < 53.5) {
      waveImg.style.opacity = '0';
      bossImg.style.opacity = '1';
      arcadeBadge.innerText = 'OVERDRIVE 256 BPM · VAULT GUARDIAN #402';
      arcadeBadge.style.borderColor = 'var(--danger)';
      arcadeBadge.style.color = 'var(--danger)';
      arcadeBadge.style.boxShadow = '0 0 20px rgba(255, 77, 109, 0.5)';
    } else {
      waveImg.style.opacity = '1';
      bossImg.style.opacity = '0';
      arcadeBadge.innerText = 'INCIDIUS 2.2 WAVE CORRIDOR · 240 TPS';
      arcadeBadge.style.borderColor = 'var(--acid)';
      arcadeBadge.style.color = 'var(--acid)';
      arcadeBadge.style.boxShadow = '0 0 20px rgba(184, 255, 101, 0.3)';
    }
  }

  // 3. Update word-level karaoke subtitles
  const phrase = phrases.find(p => t >= p.start - 0.1 && t <= p.end + 0.3);
  if (!phrase) {
    captionContainer.innerHTML = '<span style="opacity:0.4">Inside Chog · Monad Testnet</span>';
    return;
  }

  let htmlWords = '';
  for (const w of phrase.words) {
    const isActive = t >= w.start && t <= w.end + 0.08;
    const isPast = t > w.end + 0.08;
    const cls = isActive ? 'word active' : (isPast ? 'word past' : 'word');
    htmlWords += '<span class="' + cls + '">' + w.text + '</span> ';
  }
  captionContainer.innerHTML = htmlWords;
};

window.__ready = Motion.loaded();
</script>
</body>
</html>
`;

fs.writeFileSync('c:/Users/HP LAPTOP/Documents/chug nft/motion_film/index.html', html);
console.log('Successfully generated motion_film/index.html with wrapped seek and clean CSS visibility!');
