import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig, staticFile, Img } from "remotion";
import { THEME, SPRING_SNAPPY, SPRING_SMOOTH } from "../theme";

export const Scene5_AblationHalt: React.FC<{ frames: number }> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Eject happens at frame 100 (1.67s, when VO says "Watch what happens when we eject the cartridge")
  const isEjected = frame >= 100;
  const ejectSpring = spring({
    frame: frame - 100,
    fps,
    config: SPRING_SNAPPY,
  });

  // Re-insert happens at frame 670 (11.1s, when VO says "It is the load-bearing hardware engine")
  const isReinserted = frame >= 670;
  const reinsertSpring = spring({
    frame: frame - 670,
    fps,
    config: SPRING_SNAPPY,
  });

  return (
    <AbsoluteFill style={{ backgroundColor: THEME.bg, fontFamily: THEME.fontSans, overflow: "hidden" }}>
      {/* Background World Grid */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `linear-gradient(to right, rgba(255, 77, 109, 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 77, 109, 0.05) 1px, transparent 1px)`,
          backgroundSize: "48px 48px",
          filter: isEjected && !isReinserted ? "grayscale(100%) brightness(30%)" : "none",
        }}
      />

      {/* Top Header */}
      <div style={{ position: "absolute", top: 48, left: 80, display: "flex", alignItems: "center", gap: 16 }}>
        <span
          style={{
            padding: "8px 16px",
            background: THEME.crimson,
            color: "#ffffff",
            fontWeight: 800,
            fontSize: 14,
            borderRadius: 6,
            letterSpacing: "0.08em",
          }}
        >
          LOAD-BEARING TEST
        </span>
        <span style={{ color: THEME.white, fontSize: 24, fontWeight: 700, letterSpacing: "-0.02em" }}>
          THE ABLATION AUDIT: REMOVE THE NFT → THE SYSTEM COLLAPSES
        </span>
      </div>

      {/* Center Console */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "100%",
          maxWidth: 1080,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* Cartridge Ejection Bay */}
        <div
          style={{
            background: THEME.cardBg,
            border: `2px solid ${isEjected && !isReinserted ? THEME.crimson : THEME.gold}`,
            borderRadius: 24,
            padding: 36,
            width: "100%",
            textAlign: "center",
            boxShadow: isEjected && !isReinserted ? "0 0 80px rgba(255, 77, 109, 0.3)" : "none",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
            <div style={{ color: THEME.muted, fontSize: 13, fontWeight: 700 }}>PHYSICAL CARTRIDGE INTERFACE</div>
            <div
              style={{
                color: isEjected && !isReinserted ? THEME.crimson : THEME.emerald,
                fontWeight: 800,
                fontSize: 14,
                fontFamily: THEME.fontMono,
              }}
            >
              {isEjected && !isReinserted ? "● EJECTED · OFFLINE" : "● MOUNTED · ACTIVE"}
            </div>
          </div>

          {/* Cartridge Slot Animation */}
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 40, margin: "20px 0" }}>
            <div
              style={{
                transform: `translateY(${isEjected && !isReinserted ? interpolate(ejectSpring, [0, 1], [0, -80]) : isReinserted ? interpolate(reinsertSpring, [0, 1], [-80, 0]) : 0}px)`,
                background: "rgba(0, 0, 0, 0.6)",
                border: `2px solid ${isEjected && !isReinserted ? THEME.crimson : THEME.gold}`,
                borderRadius: 16,
                padding: 16,
                width: 240,
                boxShadow: "0 16px 36px rgba(0,0,0,0.5)",
              }}
            >
              <Img src={staticFile("chog1.jpg")} style={{ width: 204, height: 204, borderRadius: 10, objectFit: "cover" }} />
              <div style={{ color: THEME.white, fontWeight: 800, marginTop: 12 }}>CHOG #402 ROM</div>
            </div>
          </div>

          {/* Fatal Error Callout when ejected */}
          {isEjected && !isReinserted ? (
            <div
              style={{
                marginTop: 20,
                background: "rgba(40, 5, 15, 0.95)",
                border: `2px solid ${THEME.crimson}`,
                borderRadius: 14,
                padding: 20,
              }}
            >
              <div style={{ color: THEME.crimson, fontWeight: 900, fontSize: 24 }}>
                ERR_EMPTY_CARTRIDGE · EXECUTION REFUSED
              </div>
              <div style={{ color: THEME.white, fontSize: 15, marginTop: 6 }}>
                Without the Chog NFT token hash, no dungeon layout can compile and no yield routes.
              </div>
            </div>
          ) : isReinserted ? (
            <div
              style={{
                marginTop: 20,
                background: "rgba(10, 30, 20, 0.95)",
                border: `2px solid ${THEME.emerald}`,
                borderRadius: 14,
                padding: 20,
              }}
            >
              <div style={{ color: THEME.emerald, fontWeight: 900, fontSize: 24 }}>
                CARTRIDGE RE-INSERTED · FULL RESTORATION
              </div>
              <div style={{ color: THEME.white, fontSize: 15, marginTop: 6 }}>
                Hardware anchor verified: token hash loads 60FPS vault physics.
              </div>
            </div>
          ) : (
            <div style={{ color: THEME.muted, fontSize: 15 }}>
              Clicking eject immediately halts the engine to prove the NFT is load-bearing.
            </div>
          )}
        </div>
      </div>
    </AbsoluteFill>
  );
};
