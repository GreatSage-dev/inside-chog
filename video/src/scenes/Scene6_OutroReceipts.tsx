import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { THEME, SPRING_SNAPPY, SPRING_SMOOTH } from "../theme";

export const Scene6_OutroReceipts: React.FC<{ frames: number }> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Pull back camera spring
  const pullBack = spring({
    frame,
    fps,
    config: SPRING_SMOOTH,
  });

  // Wordmark settle spring (6.5s / frame 390, when VO says "Verified contracts. Zero mocks.")
  const wordmarkSpring = spring({
    frame: frame - 390,
    fps,
    config: SPRING_SNAPPY,
  });

  return (
    <AbsoluteFill style={{ backgroundColor: THEME.bg, fontFamily: THEME.fontSans, overflow: "hidden" }}>
      {/* Background Matrix */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `linear-gradient(to right, rgba(255, 209, 102, 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 209, 102, 0.05) 1px, transparent 1px)`,
          backgroundSize: "48px 48px",
        }}
      />

      {/* Main Center Callout */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: `translate(-50%, -50%) scale(${interpolate(pullBack, [0, 1], [1.1, 1.0])})`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          width: "100%",
          maxWidth: 1100,
        }}
      >
        {/* Verification Receipts Card */}
        <div
          style={{
            background: THEME.cardBg,
            border: `2px solid ${THEME.emerald}`,
            borderRadius: 24,
            padding: 36,
            width: "100%",
            boxShadow: "0 24px 64px rgba(0, 0, 0, 0.6)",
          }}
        >
          <div style={{ color: THEME.emerald, fontWeight: 800, fontSize: 14, letterSpacing: "0.08em" }}>
            MONAD TESTNET DEPLOYMENT · ZERO-MOCK VERIFIED
          </div>

          <div style={{ color: THEME.white, fontWeight: 900, fontSize: 44, marginTop: 12, letterSpacing: "-0.02em" }}>
            DEAD JPEGS NOW BLEED YIELD
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: 20,
              marginTop: 32,
              textAlign: "left",
            }}
          >
            <div style={{ background: "rgba(0,0,0,0.5)", padding: 18, borderRadius: 14, border: "1px solid rgba(255,255,255,0.1)" }}>
              <div style={{ color: THEME.muted, fontSize: 11, fontWeight: 700 }}>CONTRACT</div>
              <div style={{ color: THEME.gold, fontSize: 16, fontWeight: 800, fontFamily: THEME.fontMono, marginTop: 4 }}>
                0x6D8d...8c36
              </div>
              <div style={{ color: THEME.emerald, fontSize: 11, marginTop: 4 }}>Verified on Monad Explorer</div>
            </div>

            <div style={{ background: "rgba(0,0,0,0.5)", padding: 18, borderRadius: 14, border: "1px solid rgba(255,255,255,0.1)" }}>
              <div style={{ color: THEME.muted, fontSize: 11, fontWeight: 700 }}>UNIT TESTS</div>
              <div style={{ color: THEME.emerald, fontSize: 16, fontWeight: 800, marginTop: 4 }}>
                5/5 PASS (0 FAIL)
              </div>
              <div style={{ color: THEME.muted, fontSize: 11, marginTop: 4 }}>Deterministic exit code 0</div>
            </div>

            <div style={{ background: "rgba(0,0,0,0.5)", padding: 18, borderRadius: 14, border: "1px solid rgba(255,255,255,0.1)" }}>
              <div style={{ color: THEME.muted, fontSize: 11, fontWeight: 700 }}>PRODUCTION</div>
              <div style={{ color: THEME.cyan, fontSize: 16, fontWeight: 800, marginTop: 4 }}>
                LIVE ON VERCEL
              </div>
              <div style={{ color: THEME.muted, fontSize: 11, marginTop: 4 }}>inside-chog.vercel.app</div>
            </div>
          </div>
        </div>

        {/* Wordmark Settle */}
        {frame >= 200 && (
          <div
            style={{
              marginTop: 40,
              transform: `scale(${wordmarkSpring})`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <div style={{ color: THEME.gold, fontWeight: 900, fontSize: 52, letterSpacing: "0.08em" }}>
              INSIDE CHOG
            </div>
            <div style={{ color: THEME.muted, fontSize: 16, marginTop: 6, letterSpacing: "0.04em" }}>
              PLAY NOW: HTTPS://INSIDE-CHOG.VERCEL.APP · CHOGATHON 2026
            </div>
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};
