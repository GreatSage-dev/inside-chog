export const WIDTH = 1920;
export const HEIGHT = 1080;
export const FPS = 60;

export type SceneId = "hook" | "revenue" | "wave" | "social" | "ablation" | "outro";

export interface SceneMeta {
  id: SceneId;
  name: string;
  from: number;
  frames: number;
}

export const SCENES: Omit<SceneMeta, "from">[] = [
  { id: "hook", name: "15s Split Hook (Dead JPEG vs Arcade)", frames: 990 }, // 16.5s (VO: 15.93s)
  { id: "revenue", name: "40/50/10 Financial Revenue Engine", frames: 1050 }, // 17.5s (VO: 16.58s)
  { id: "wave", name: "Geometry Dash 2.2 Wave & 240 TPS Sparks", frames: 1170 }, // 19.5s (VO: 18.81s)
  { id: "social", name: "AI Social Intercom & Jailbreak Governor", frames: 960 }, // 16.0s (VO: 14.95s)
  { id: "ablation", name: "Load-Bearing Ablation Test (ERR_EMPTY_CARTRIDGE)", frames: 1020 }, // 17.0s (VO: 16.11s)
  { id: "outro", name: "Monad Testnet Receipts & Hall of Fame", frames: 990 }, // 16.5s (VO: 15.42s)
];

let currentFrom = 0;
export const TIMELINE: SceneMeta[] = SCENES.map((scene) => {
  const meta: SceneMeta = {
    ...scene,
    from: currentFrom,
  };
  currentFrom += scene.frames;
  return meta;
});

export const TOTAL_FRAMES = currentFrom; // 6180 frames = 103 seconds (~1m 43s)
export const TOTAL_SECONDS = Math.round(TOTAL_FRAMES / FPS);
