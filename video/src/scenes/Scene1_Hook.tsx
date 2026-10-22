import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig, staticFile, Img } from "remotion";
import { THEME, SPRING_SNAPPY, SPRING_SMOOTH } from "../theme";

export const Scene1_Hook: React.FC<{ frames: number }> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance spring for split screen
  const introProgress = spring({
    frame,
    fps,
    config: SPRING_SMOOTH,
  });

  // Card grab & slot transition (starts at frame 450 / 7.5s when VO asks "What if your NFT was an arcade machine...")
  const slotProgress = spring({
    frame: frame - 450,
    fps,
    config: SPRING_SNAPPY,
  });

  // Screen expansion on drop (frame 510 / 8.5s)
  const expandProgress = spring({
    frame: frame - 510,
    fps,
    config: { damping: 18, mass: 1.0, stiffness: 120 },
  });

  // Card translation from left to right slot
  const cardX = interpolate(slotProgress, [0, 1], [0, 850]);
  const cardY = interpolate(slotProgress, [0, 0.5, 1], [0, -60, 40]);
  const cardScale = interpolate(slotProgress, [0, 0.4, 1], [1, 1.08, 0.92]);
  const cardRotate = interpolate(slotProgress, [0, 0.5, 1], [0, -12, 0]);

  // Flash luminescence on drop
  const flashOpacity = interpolate(frame, [508, 512, 530], [0, 0.85, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: THEME.bg, fontFamily: THEME.fontSans, overflow: "hidden" }}>
      {/* Background World Grid */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `linear-gradient(to right, rgba(255, 209, 102, 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 209, 102, 0.05) 1px, transparent 1px)`,
          backgroundSize: "48px 48px",
          opacity: introProgress,
        }}
      />

      {/* Top Header Badge */}
      <div
        style={{
          position: "absolute",
          top: 48,
          left: 80,
          display: "flex",
          alignItems: "center",
          gap: 16,
          opacity: introProgress,
        }}
      >
        <span
          style={{
            padding: "8px 16px",
            background: THEME.gold,
            color: "#050811",
            fontWeight: 800,
            fontSize: 14,
            borderRadius: 6,
            letterSpacing: "0.08em",
          }}
        >
          STEP 01
        </span>
        <span style={{ color: THEME.white, fontSize: 24, fontWeight: 700, letterSpacing: "-0.02em" }}>
          THE HIGH-STAKES TRUTH: DEAD JPEGS EARN $0
        </span>
      </div>

      {/* Split Screen Container */}
      <div
        style={{
          position: "absolute",
          top: 140,
          bottom: 90,
          left: 80,
          right: 80,
          display: "grid",
          gridTemplateColumns: `${interpolate(expandProgress, [0, 1], [50, 15])}% ${interpolate(expandProgress, [0, 1], [50, 85])}%`,
          gap: 40,
        }}
      >
        {/* LEFT: THE NAIVE STATUS QUO */}
        <div
          style={{
            position: "relative",
            background: "rgba(10, 15, 28, 0.65)",
            border: "1px solid rgba(255, 77, 109, 0.3)",
            borderRadius: 24,
            padding: 36,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            opacity: interpolate(expandProgress, [0, 0.7], [1, 0.25]),
            transform: `scale(${interpolate(expandProgress, [0, 1], [1, 0.9])})`,
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 24,
              left: 24,
              padding: "4px 12px",
              background: "rgba(255, 77, 109, 0.15)",
              border: "1px solid rgba(255, 77, 109, 0.4)",
              borderRadius: 6,
              color: THEME.crimson,
              fontSize: 12,
              fontWeight: 700,
            }}
          >
            STATUS QUO: DORMANT COLD WALLET
          </div>

          {/* The Chog NFT Card (Moving on slot) */}
          <div
            style={{
              transform: `translate(${cardX}px, ${cardY}px) scale(${cardScale}) rotate(${cardRotate}deg)`,
              transition: "transform 0.05s linear",
              background: THEME.cardBg,
              border: `2px solid ${THEME.glassBorder}`,
              borderRadius: 20,
              padding: 20,
              width: 320,
              boxShadow: "0 24px 48px rgba(0, 0, 0, 0.6)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Img
              src={staticFile("chog1.jpg")}
              style={{
                width: 280,
                height: 280,
                borderRadius: 14,
                objectFit: "cover",
              }}
            />
            <div style={{ marginTop: 16, width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ color: THEME.white, fontWeight: 800, fontSize: 18 }}>CHOG #402</div>
                <div style={{ color: THEME.muted, fontSize: 13, fontFamily: THEME.fontMono }}>ERC-721 Genesis</div>
              </div>
              <div
                style={{
                  background: "rgba(255, 77, 109, 0.2)",
                  color: THEME.crimson,
                  padding: "4px 10px",
                  borderRadius: 6,
                  fontWeight: 700,
                  fontSize: 12,
                }}
              >
                $0 YIELD
              </div>
            </div>
          </div>

          <div style={{ marginTop: 28, textAlign: "center", color: THEME.muted, fontSize: 15, maxWidth: 360 }}>
            95% of NFT collections sit dormant in cold wallets. Zero utility, zero liquidity.
          </div>
        </div>

        {/* RIGHT: INSIDE CHOG ARCADE CARTRIDGE BAY */}
        <div
          style={{
            position: "relative",
            background: "rgba(9, 17, 34, 0.9)",
            border: `2px solid ${expandProgress > 0.5 ? THEME.gold : "rgba(255, 209, 102, 0.3)"}`,
            borderRadius: 24,
            padding: 36,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: expandProgress > 0.5 ? "0 0 60px rgba(255, 209, 102, 0.25)" : "none",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 24,
              left: 24,
              padding: "4px 12px",
              background: "rgba(184, 255, 101, 0.15)",
              border: "1px solid rgba(184, 255, 101, 0.4)",
              borderRadius: 6,
              color: THEME.emerald,
              fontSize: 12,
              fontWeight: 700,
            }}
          >
            INSIDE CHOG: EXECUTABLE CARTRIDGE BAY
          </div>

          {/* Cartridge Slot Target */}
          <div
            style={{
              width: 360,
              height: 220,
              border: `2px dashed ${slotProgress > 0.8 ? THEME.emerald : THEME.gold}`,
              borderRadius: 18,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(0, 0, 0, 0.45)",
              padding: 24,
            }}
          >
            {frame < 510 ? (
              <>
                <div style={{ color: THEME.gold, fontWeight: 700, fontSize: 16 }}>SLOT CHOG NFT TO BOOT</div>
                <div style={{ color: THEME.muted, fontSize: 13, marginTop: 6 }}>Compiles token hash to executable vault</div>
              </>
            ) : (
              <div style={{ textAlign: "center" }}>
                <div style={{ color: THEME.emerald, fontWeight: 800, fontSize: 26, letterSpacing: "-0.01em" }}>
                  VAULT #402 ONLINE · 60FPS
                </div>
                <div style={{ color: THEME.gold, fontSize: 16, fontWeight: 700, marginTop: 8 }}>
                  ENTRY TOLL: 0.05 MON ($CHOG REVENUE)
                </div>
              </div>
            )}
          </div>

          {/* Metrics Pill Grid on Drop */}
          {frame >= 510 && (
            <div
              style={{
                marginTop: 28,
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                gap: 16,
                width: "100%",
                maxWidth: 620,
              }}
            >
              <div style={{ background: "rgba(0,0,0,0.5)", padding: "14px 18px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.1)" }}>
                <div style={{ color: THEME.muted, fontSize: 11, fontWeight: 700 }}>LANDLORD YIELD</div>
                <div style={{ color: THEME.gold, fontSize: 20, fontWeight: 800 }}>40% INSTANT</div>
              </div>
              <div style={{ background: "rgba(0,0,0,0.5)", padding: "14px 18px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.1)" }}>
                <div style={{ color: THEME.muted, fontSize: 11, fontWeight: 700 }}>BOUNTY JACKPOT</div>
                <div style={{ color: THEME.emerald, fontSize: 20, fontWeight: 800 }}>50% POOL</div>
              </div>
              <div style={{ background: "rgba(0,0,0,0.5)", padding: "14px 18px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.1)" }}>
                <div style={{ color: THEME.muted, fontSize: 11, fontWeight: 700 }}>PERMANENT BURN</div>
                <div style={{ color: THEME.crimson, fontSize: 20, fontWeight: 800 }}>10% SINK</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Drop Flash */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: THEME.gold,
          opacity: flashOpacity,
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};
