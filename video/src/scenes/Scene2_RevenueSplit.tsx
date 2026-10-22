import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { THEME, SPRING_SNAPPY, SPRING_SMOOTH } from "../theme";

export const Scene2_RevenueSplit: React.FC<{ frames: number }> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Button expansion spring (Challenger pays 0.05 MON ticket at 3.8s / frame 230)
  const clickSpring = spring({
    frame: frame - 230,
    fps,
    config: SPRING_SNAPPY,
  });

  // Stream emission spring (40/50/10 split at 7.5s / frame 450)
  const streamSpring = spring({
    frame: frame - 450,
    fps,
    config: SPRING_SMOOTH,
  });

  // Receipt confirmation spring (wallet cash flow at 12.5s / frame 750)
  const receiptSpring = spring({
    frame: frame - 750,
    fps,
    config: SPRING_SNAPPY,
  });

  // Live counter meters
  const landlordMon = (interpolate(streamSpring, [0, 1], [0, 0.02])).toFixed(3);
  const jackpotMon = (interpolate(streamSpring, [0, 1], [0, 0.025])).toFixed(3);
  const burnMon = (interpolate(streamSpring, [0, 1], [0, 0.005])).toFixed(3);

  return (
    <AbsoluteFill style={{ backgroundColor: THEME.bg, fontFamily: THEME.fontSans, overflow: "hidden" }}>
      {/* Background Matrix */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `linear-gradient(to right, rgba(184, 255, 101, 0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(184, 255, 101, 0.04) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Top Header */}
      <div style={{ position: "absolute", top: 48, left: 80, display: "flex", alignItems: "center", gap: 16 }}>
        <span
          style={{
            padding: "8px 16px",
            background: THEME.emerald,
            color: "#050811",
            fontWeight: 800,
            fontSize: 14,
            borderRadius: 6,
            letterSpacing: "0.08em",
          }}
        >
          STEP 02
        </span>
        <span style={{ color: THEME.white, fontSize: 24, fontWeight: 700, letterSpacing: "-0.02em" }}>
          THE 40 / 50 / 10 REVENUE ENGINE: MONAD ON-CHAIN CASH FLOW
        </span>
      </div>

      {/* Central Morphing Hub */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
          maxWidth: 1200,
        }}
      >
        {/* The Central Slate */}
        <div
          style={{
            background: THEME.cardBg,
            border: `2px solid ${THEME.gold}`,
            borderRadius: interpolate(clickSpring, [0, 1], [16, 28]),
            padding: interpolate(clickSpring, [0, 1], [18, 36]),
            width: interpolate(clickSpring, [0, 1], [420, 880]),
            textAlign: "center",
            boxShadow: "0 24px 64px rgba(0, 0, 0, 0.6)",
            position: "relative",
          }}
        >
          {frame < 240 ? (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 14 }}>
              <div style={{ width: 14, height: 14, borderRadius: "50%", background: THEME.emerald }} />
              <div style={{ color: THEME.white, fontWeight: 800, fontSize: 22, letterSpacing: "0.02em" }}>
                RAID ENTRY TOLL: 0.05 MON
              </div>
            </div>
          ) : (
            <div>
              <div style={{ color: THEME.muted, fontSize: 13, fontWeight: 700, letterSpacing: "0.08em" }}>
                AUTOMATIC MECHANICAL REVENUE SPLIT (PER RAID)
              </div>
              <div style={{ color: THEME.gold, fontSize: 32, fontWeight: 800, marginTop: 4 }}>
                0.050 MON DEPOSIT CONFIRMED
              </div>

              {/* 3 Split Streams */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 24, marginTop: 32 }}>
                {/* 40% Landlord */}
                <div
                  style={{
                    background: "rgba(255, 209, 102, 0.08)",
                    border: `1.5px solid ${THEME.gold}`,
                    borderRadius: 18,
                    padding: 24,
                    transform: `translateY(${interpolate(streamSpring, [0, 1], [40, 0])}px)`,
                    opacity: streamSpring,
                  }}
                >
                  <div style={{ color: THEME.gold, fontWeight: 800, fontSize: 13 }}>40% LANDLORD YIELD</div>
                  <div style={{ color: THEME.white, fontSize: 36, fontWeight: 800, marginTop: 8 }}>
                    +{landlordMon} <span style={{ fontSize: 16 }}>MON</span>
                  </div>
                  <div style={{ color: THEME.muted, fontSize: 12, marginTop: 6, fontFamily: THEME.fontMono }}>
                    Routes to ownerOf(tokenId)
                  </div>
                </div>

                {/* 50% Bounty */}
                <div
                  style={{
                    background: "rgba(184, 255, 101, 0.08)",
                    border: `1.5px solid ${THEME.emerald}`,
                    borderRadius: 18,
                    padding: 24,
                    transform: `translateY(${interpolate(streamSpring, [0, 1], [40, 0])}px)`,
                    opacity: streamSpring,
                  }}
                >
                  <div style={{ color: THEME.emerald, fontWeight: 800, fontSize: 13 }}>50% JACKPOT POOL</div>
                  <div style={{ color: THEME.white, fontSize: 36, fontWeight: 800, marginTop: 8 }}>
                    +{jackpotMon} <span style={{ fontSize: 16 }}>MON</span>
                  </div>
                  <div style={{ color: THEME.muted, fontSize: 12, marginTop: 6, fontFamily: THEME.fontMono }}>
                    Vault Chest Bounty
                  </div>
                </div>

                {/* 10% Burn */}
                <div
                  style={{
                    background: "rgba(255, 77, 109, 0.08)",
                    border: `1.5px solid ${THEME.crimson}`,
                    borderRadius: 18,
                    padding: 24,
                    transform: `translateY(${interpolate(streamSpring, [0, 1], [40, 0])}px)`,
                    opacity: streamSpring,
                  }}
                >
                  <div style={{ color: THEME.crimson, fontWeight: 800, fontSize: 13 }}>10% DEFLATION BURN</div>
                  <div style={{ color: THEME.white, fontSize: 36, fontWeight: 800, marginTop: 8 }}>
                    +{burnMon} <span style={{ fontSize: 16 }}>MON</span>
                  </div>
                  <div style={{ color: THEME.muted, fontSize: 12, marginTop: 6, fontFamily: THEME.fontMono }}>
                    0x000...dEaD Burn Sink
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* On-Chain Receipt Badge */}
        {frame >= 320 && (
          <div
            style={{
              marginTop: 36,
              background: "rgba(10, 20, 38, 0.95)",
              border: `1px solid ${THEME.emerald}`,
              borderRadius: 12,
              padding: "16px 28px",
              display: "flex",
              alignItems: "center",
              gap: 16,
              transform: `scale(${receiptSpring})`,
              boxShadow: "0 12px 32px rgba(184, 255, 101, 0.2)",
            }}
          >
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: "50%",
                background: THEME.emerald,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#050811",
                fontWeight: 900,
              }}
            >
              ✓
            </div>
            <div style={{ textAlign: "left" }}>
              <div style={{ color: THEME.white, fontWeight: 700, fontSize: 14 }}>
                MONAD TESTNET TRANSACTION VERIFIED · BLOCK #19,402
              </div>
              <div style={{ color: THEME.muted, fontSize: 12, fontFamily: THEME.fontMono, marginTop: 2 }}>
                Tx: 0x121970a2b897452f0d26d4efb7c41830bf052576e34ec811ac20b2f4f58438f0
              </div>
            </div>
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};
