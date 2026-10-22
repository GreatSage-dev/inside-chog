import React, { useMemo } from "react";
import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { TIMELINE, SceneId } from "../timeline";
import manifestData from "../vo-manifest.json";

interface Word {
  text: string;
  start: number;
  end: number;
}

interface Chunk {
  words: Word[];
  start: number;
  end: number;
  text: string;
}

// Pre-chunk words into natural human speech phrases (3 to 6 words each)
function buildChunks(words: Word[]): Chunk[] {
  const chunks: Chunk[] = [];
  let cur: Word[] = [];

  for (let i = 0; i < words.length; i++) {
    cur.push(words[i]);
    const endsWithPunct = /[.,?!;:]$/.test(words[i].text);
    const isLast = i === words.length - 1;

    if ((cur.length >= 3 && endsWithPunct) || cur.length >= 6 || isLast) {
      chunks.push({
        words: [...cur],
        start: cur[0].start,
        end: cur[cur.length - 1].end,
        text: cur.map((w) => w.text).join(" "),
      });
      cur = [];
    }
  }

  return chunks;
}

export const Captions: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Pre-process chunks for all scenes once
  const sceneChunks = useMemo(() => {
    const map: Partial<Record<SceneId, Chunk[]>> = {};
    for (const [id, data] of Object.entries(manifestData)) {
      map[id as SceneId] = buildChunks(data.words);
    }
    return map;
  }, []);

  // Identify which scene is currently playing
  const currentScene = TIMELINE.find(
    (s) => frame >= s.from && frame < s.from + s.frames
  );

  if (!currentScene) return null;

  const localTime = (frame - currentScene.from) / fps;
  const chunks = sceneChunks[currentScene.id] || [];

  // Find the active chunk (giving 0.15s lead-in and 0.35s hang-time for reading comfort)
  const activeChunkIndex = chunks.findIndex(
    (c) => localTime >= c.start - 0.12 && localTime <= c.end + 0.35
  );

  const activeChunk = activeChunkIndex !== -1 ? chunks[activeChunkIndex] : null;

  if (!activeChunk) {
    return null;
  }

  // Determine active word within the active chunk
  let activeWordIndex = activeChunk.words.findIndex(
    (w) => localTime >= w.start && localTime <= w.end + 0.1
  );

  // If between words in an active chunk, highlight the last spoken word
  if (activeWordIndex === -1) {
    for (let i = activeChunk.words.length - 1; i >= 0; i--) {
      if (localTime >= activeChunk.words[i].end) {
        activeWordIndex = i;
        break;
      }
    }
  }

  // Fade in and out gently around chunk boundaries
  const timeSinceStart = localTime - (activeChunk.start - 0.12);
  const timeUntilEnd = activeChunk.end + 0.35 - localTime;
  const chunkOpacity = Math.min(
    1,
    Math.max(0, interpolate(timeSinceStart, [0, 0.15], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })),
    Math.max(0, interpolate(timeUntilEnd, [0, 0.2], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }))
  );

  return (
    <div
      style={{
        position: "absolute",
        bottom: 24,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 9999,
        opacity: chunkOpacity,
        pointerEvents: "none",
        transition: "opacity 0.15s ease",
      }}
    >
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 12,
          padding: "10px 22px",
          background: "rgba(6, 10, 22, 0.88)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: "1px solid rgba(255, 209, 102, 0.26)",
          borderRadius: 9999,
          boxShadow: "0 10px 32px rgba(0, 0, 0, 0.75), 0 0 16px rgba(255, 209, 102, 0.12)",
          whiteSpace: "nowrap",
        }}
      >
        {/* Subtle Audio Status Pill */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            paddingRight: 10,
            borderRight: "1px solid rgba(255, 255, 255, 0.15)",
          }}
        >
          <div
            style={{
              width: 7,
              height: 7,
              borderRadius: "50%",
              background: "#ffd166",
              boxShadow: "0 0 8px #ffd166",
              animation: "pulse 1.5s infinite",
            }}
          />
          <span
            style={{
              fontFamily: "'SF Mono', Monaco, Menlo, Consolas, monospace",
              fontSize: 10,
              fontWeight: 800,
              letterSpacing: "0.1em",
              color: "#ffd166",
              textTransform: "uppercase",
            }}
          >
            NARRATION
          </span>
        </div>

        {/* Word Sequence */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 7,
            fontFamily:
              "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
            fontSize: 20,
            lineHeight: 1,
            letterSpacing: "-0.01em",
          }}
        >
          {activeChunk.words.map((w, idx) => {
            const isSpoken = idx < activeWordIndex;
            const isActive = idx === activeWordIndex;
            const isUpcoming = idx > activeWordIndex;

            let color = "rgba(255, 255, 255, 0.45)";
            let fontWeight = 500;
            let textShadow = "none";
            let transform = "scale(1)";

            if (isActive) {
              color = "#ffd166"; // Chog Gold highlight
              fontWeight = 800;
              textShadow = "0 0 14px rgba(255, 209, 102, 0.85)";
              transform = "scale(1.06)";
            } else if (isSpoken) {
              color = "#ffffff";
              fontWeight = 600;
            }

            return (
              <span
                key={`${w.text}-${idx}`}
                style={{
                  color,
                  fontWeight,
                  textShadow,
                  transform,
                  display: "inline-block",
                  transition: "color 0.12s ease, transform 0.12s ease",
                }}
              >
                {w.text}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
};
