import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig, staticFile, Img } from "remotion";
import { THEME, SPRING_SNAPPY, SPRING_SMOOTH } from "../theme";

export const Scene3_WaveArcade: React.FC<{ frames: number }> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Progress percentage (0% to 100%)
  const progress = Math.min(100, Math.floor((frame / 1170) * 100));

  // Overdrive drop at frame 900 (15.0s, when VO says "drops at 256 BPM")
  const isOverdrive = frame >= 900;
  const bpm = isOverdrive ? 256 : frame >= 450 ? 146 : 132;

  // Wave runner vertical oscillating motion inside 800px arena
  const waveY = 380 + Math.sin(frame * 0.12) * 150;

  // Near miss moment around frame 620 to 740 (10.3s to 12.3s, when VO says "near-miss sparks")
  const isNearMiss = frame >= 620 && frame <= 740;
  const nearMissSpring = spring({
    frame: frame - 620,
    fps,
    config: SPRING_SNAPPY,
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "#060a14", fontFamily: THEME.fontSans, overflow: "hidden" }}>
      {/* Dynamic Pulsing Grid (beatPulse effect) */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `linear-gradient(to right, ${isOverdrive ? "rgba(255, 77, 109, 0.08)" : "rgba(92, 225, 230, 0.08)"} 1px, transparent 1px), linear-gradient(to bottom, ${isOverdrive ? "rgba(255, 77, 109, 0.08)" : "rgba(92, 225, 230, 0.08)"} 1px, transparent 1px)`,
          backgroundSize: "44px 44px",
        }}
      />

      {/* Top Header */}
      <div style={{ position: "absolute", top: 48, left: 80, display: "flex", alignItems: "center", gap: 16 }}>
        <span
          style={{
            padding: "8px 16px",
            background: THEME.cyan,
            color: "#050811",
            fontWeight: 800,
            fontSize: 14,
            borderRadius: 6,
            letterSpacing: "0.08em",
          }}
        >
          ENGINE 02
        </span>
        <span style={{ color: THEME.white, fontSize: 24, fontWeight: 700, letterSpacing: "-0.02em" }}>
          GEOMETRY DASH 2.2 PHYSICS · 240 TPS & ROBTOP 60% INNER HITBOXES
        </span>
      </div>

      {/* Top Telemetry Bar */}
      <div
        style={{
          position: "absolute",
          top: 110,
          left: 80,
          right: 80,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "rgba(10, 18, 34, 0.8)",
          border: `1px solid ${THEME.glassBorder}`,
          borderRadius: 14,
          padding: "12px 24px",
        }}
      >
        <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
          <div>
            <span style={{ color: THEME.muted, fontSize: 12 }}>PHYSICS RATE: </span>
            <span style={{ color: THEME.emerald, fontWeight: 800, fontFamily: THEME.fontMono }}>240 TPS (4.16ms)</span>
          </div>
          <div>
            <span style={{ color: THEME.muted, fontSize: 12 }}>PROCEDURAL EDM: </span>
            <span style={{ color: isOverdrive ? THEME.crimson : THEME.gold, fontWeight: 800, fontFamily: THEME.fontMono }}>
              {bpm} BPM {isOverdrive ? "🔥 OVERDRIVE DROP" : "D MINOR"}
            </span>
          </div>
        </div>
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <div style={{ color: THEME.white, fontWeight: 800, fontSize: 18 }}>{progress}%</div>
          <div style={{ width: 180, height: 10, background: "rgba(255,255,255,0.1)", borderRadius: 5, overflow: "hidden" }}>
            <div style={{ width: `${progress}%`, height: "100%", background: isOverdrive ? THEME.crimson : THEME.gold }} />
          </div>
        </div>
      </div>

      {/* Arcade Gameplay Arena */}
      <div
        style={{
          position: "absolute",
          top: 180,
          bottom: 100,
          left: 80,
          right: 80,
          background: "rgba(5, 10, 20, 0.95)",
          border: `2px solid ${isOverdrive ? THEME.crimson : THEME.cyan}`,
          borderRadius: 20,
          overflow: "hidden",
        }}
      >
        {/* Top Ceiling & Bottom Floor */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 46, background: "#1c040b", borderBottom: `2px solid ${isOverdrive ? THEME.crimson : THEME.cyan}` }} />
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 46, background: "#1c040b", borderTop: `2px solid ${isOverdrive ? THEME.crimson : THEME.cyan}` }} />

        {/* Moving Sawblade Obstacle */}
        <div
          style={{
            position: "absolute",
            left: 780,
            top: 320,
            width: 90,
            height: 90,
            borderRadius: "50%",
            border: "3px dashed #ff4d6d",
            background: "rgba(255, 77, 109, 0.2)",
            transform: `rotate(${frame * 8}deg)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* RobTop 60% Inner Deadly Core */}
          <div
            style={{
              width: 54,
              height: 54,
              borderRadius: "50%",
              background: "#ff4d6d",
              boxShadow: "0 0 16px #ff4d6d",
            }}
          />
        </div>

        {/* Near-Miss Diagnostic Callout at Frame 420 */}
        {isNearMiss && (
          <div
            style={{
              position: "absolute",
              left: 740,
              top: 230,
              background: "rgba(10, 20, 38, 0.95)",
              border: `1.5px solid ${THEME.gold}`,
              borderRadius: 10,
              padding: "10px 18px",
              transform: `scale(${nearMissSpring})`,
              boxShadow: "0 8px 24px rgba(255, 209, 102, 0.3)",
              zIndex: 10,
            }}
          >
            <div style={{ color: THEME.gold, fontWeight: 800, fontSize: 13 }}>
              ⚡ ROBTOP 60% INNER HITBOX: 2PX NEAR-MISS!
            </div>
            <div style={{ color: THEME.white, fontSize: 11, marginTop: 2 }}>
              Player clears outer border · #ffd166 friction sparks emitted · 100% fair survival
            </div>
          </div>
        )}

        {/* Chog 45-Degree Wave Rider */}
        <div
          style={{
            position: "absolute",
            left: 420,
            top: waveY,
            width: 48,
            height: 48,
            transform: "translate(-50%, -50%) rotate(45deg)",
            background: isOverdrive ? THEME.crimson : THEME.gold,
            border: `2px solid ${THEME.white}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: `0 0 24px ${isOverdrive ? THEME.crimson : THEME.gold}`,
          }}
        >
          <Img src={staticFile("chog1.jpg")} style={{ width: 38, height: 38, objectFit: "cover" }} />
        </div>

        {/* Near-Miss Sparks shower at frame 420 */}
        {isNearMiss && (
          <div style={{ position: "absolute", left: 450, top: waveY }}>
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                style={{
                  position: "absolute",
                  width: 5,
                  height: 5,
                  background: THEME.gold,
                  borderRadius: "50%",
                  transform: `translate(${(Math.sin(i * 1.5) * 36)}px, ${(Math.cos(i * 1.5) * 36)}px)`,
                  boxShadow: `0 0 8px ${THEME.gold}`,
                }}
              />
            ))}
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};
