/**
 * Inside Chog Audio & Voiceover Generator with ElevenLabs
 * Generates per-scene narration with word-level timestamps and cinematic SFX.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const API_KEY = process.env.ELEVENLABS_API_KEY || "sk_b88c31298e127ba997269569b41c9bce4566bde856ca23e5";
const VOICE_ID = "nPczCjzI2devNBz1zQrb"; // Brian - Deep, authoritative, cinematic narrator
const MODEL_ID = "eleven_multilingual_v2";

export const SCRIPT = [
  {
    id: "hook",
    text: "Right now, ninety-five percent of NFTs are sitting dead in cold wallets. You bought a JPEG, and it earns you zero dollars while you wait for a buyer. What if your NFT was an arcade machine that pays you rent every time someone plays it? Welcome to Inside Chog.",
  },
  {
    id: "revenue",
    text: "Every Chog NFT compiles into an executable arcade vault. Challengers pay a zero point zero five MON entry ticket. Half of that ticket goes straight to the jackpot. Ten percent burns forever. And forty percent goes directly into the NFT owner's wallet as instant cash flow.",
  },
  {
    id: "wave",
    text: "Inside Chog runs four full arcade engines. In the Geometry Dash Wave, we ported the real twenty-two physics standard at two hundred and forty sub-ticks per second. RobTop's sixty percent inner hitboxes give you skin-of-the-teeth near-miss sparks, while procedural EDM drops at two hundred and fifty-six BPM.",
  },
  {
    id: "social",
    text: "Or play the Social Infiltration Heist. AI understands your pitch, but deterministic code decides who wins. Complimenting a Sentinel's Royal Crown triggers a two point four times flattery weakness. And prompt injections are stopped dead by the governor.",
  },
  {
    id: "ablation",
    text: "Now the ultimate test. Watch what happens when we eject the cartridge. The entire engine immediately halts. No map can generate, no vault can load, and no game can start. The Chog NFT isn't cosmetic. It is the load-bearing hardware engine.",
  },
  {
    id: "outro",
    text: "Inside Chog is live right now on Monad Testnet at inside-chog.vercel.app. Verified contracts. Zero mocks. Stop letting your JPEGs sleep. Turn them into cash-flowing arcade vaults. Thank you.",
  },
];

export const SFX = [
  { id: "cartridge_click", prompt: "heavy retro video game plastic cartridge clicking and latching into an arcade console bay", duration: 1.2 },
  { id: "monad_cash", prompt: "futuristic digital cryptocurrency coins pouring into a golden chest with electronic shimmer", duration: 1.5 },
  { id: "near_miss_spark", prompt: "metal sawblade friction sparks whistling past with electric sizzle and near miss whoosh", duration: 1.0 },
  { id: "alarm_refusal", prompt: "deep futuristic security klaxon alarm buzz with red warning hum and hydraulic lock", duration: 1.8 },
  { id: "eject_whoosh", prompt: "mechanical spring ejection lever snap with pressurized air release", duration: 1.2 },
];

function toWords(alignment) {
  const { characters, character_start_times_seconds: s, character_end_times_seconds: e } = alignment;
  const words = [];
  let cur = null;
  characters.forEach((ch, i) => {
    if (/\s/.test(ch)) {
      if (cur) words.push(cur);
      cur = null;
      return;
    }
    if (!cur) cur = { text: "", start: s[i], end: e[i] };
    cur.text += ch;
    cur.end = e[i];
  });
  if (cur) words.push(cur);
  return words;
}

async function synthVo(scene) {
  const url = `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}/with-timestamps?output_format=mp3_44100_128`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "xi-api-key": API_KEY, "Content-Type": "application/json" },
    body: JSON.stringify({
      text: scene.text,
      model_id: MODEL_ID,
      voice_settings: { stability: 0.55, similarity_boost: 0.8, style: 0.25, use_speaker_boost: true },
    }),
  });
  if (!res.ok) throw new Error(`[${scene.id}] ${res.status} ${await res.text()}`);
  const data = await res.json();
  const audio = Buffer.from(data.audio_base64, "base64");
  const words = toWords(data.alignment);
  const duration = data.alignment.character_end_times_seconds.at(-1);
  return { audio, words, duration };
}

async function synthSfx(item) {
  const url = "https://api.elevenlabs.io/v1/sound-generation";
  const res = await fetch(url, {
    method: "POST",
    headers: { "xi-api-key": API_KEY, "Content-Type": "application/json" },
    body: JSON.stringify({ text: item.prompt, duration_seconds: item.duration }),
  });
  if (!res.ok) throw new Error(`[SFX ${item.id}] ${res.status} ${await res.text()}`);
  const buf = Buffer.from(await res.arrayBuffer());
  return buf;
}

async function main() {
  const outVoDir = path.join(root, "public", "vo");
  const outSfxDir = path.join(root, "public", "sfx");
  fs.mkdirSync(outVoDir, { recursive: true });
  fs.mkdirSync(outSfxDir, { recursive: true });

  const manifestPath = path.join(root, "src", "vo-manifest.json");
  const manifest = {};

  console.log("=== 1. Synthesizing Voiceover Narration ===");
  for (const scene of SCRIPT) {
    process.stdout.write(`→ [VO] ${scene.id} ... `);
    const { audio, words, duration } = await synthVo(scene);
    fs.writeFileSync(path.join(outVoDir, `${scene.id}.mp3`), audio);
    manifest[scene.id] = { text: scene.text, duration, words };
    console.log(`${duration.toFixed(2)}s (${words.length} words, ${(audio.byteLength / 1024).toFixed(1)} KB)`);
  }

  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
  console.log(`Saved manifest to ${manifestPath}`);

  console.log("\n=== 2. Synthesizing Cinematic Sound Effects ===");
  for (const item of SFX) {
    process.stdout.write(`→ [SFX] ${item.id} ... `);
    try {
      const audio = await synthSfx(item);
      fs.writeFileSync(path.join(outSfxDir, `${item.id}.mp3`), audio);
      console.log(`Saved (${(audio.byteLength / 1024).toFixed(1)} KB)`);
    } catch (e) {
      console.log(`Error: ${e.message}`);
    }
  }

  console.log("\n=== ALL AUDIO SYNTHESIS COMPLETE ===");
}

main().catch(console.error);
