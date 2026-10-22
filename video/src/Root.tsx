import React from "react";
import { Composition, Sequence, AbsoluteFill, Audio, staticFile } from "remotion";
import { WIDTH, HEIGHT, FPS, TIMELINE, TOTAL_FRAMES, SceneId } from "./timeline";
import { Scene1_Hook } from "./scenes/Scene1_Hook";
import { Scene2_RevenueSplit } from "./scenes/Scene2_RevenueSplit";
import { Scene3_WaveArcade } from "./scenes/Scene3_WaveArcade";
import { Scene4_SocialIntercom } from "./scenes/Scene4_SocialIntercom";
import { Scene5_AblationHalt } from "./scenes/Scene5_AblationHalt";
import { Scene6_OutroReceipts } from "./scenes/Scene6_OutroReceipts";
import { Captions } from "./components/Captions";

const SCENE_COMPONENTS: Record<SceneId, React.FC<{ frames: number }>> = {
  hook: Scene1_Hook,
  revenue: Scene2_RevenueSplit,
  wave: Scene3_WaveArcade,
  social: Scene4_SocialIntercom,
  ablation: Scene5_AblationHalt,
  outro: Scene6_OutroReceipts,
};

const InsideChogVideo: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#050811" }}>
      {/* Visual Scenes & Per-Scene Audio */}
      {TIMELINE.map(({ id, from, frames }) => {
        const SceneComponent = SCENE_COMPONENTS[id];
        return (
          <Sequence key={id} from={from} durationInFrames={frames} name={id}>
            {/* Visual Scene Canvas */}
            <SceneComponent frames={frames} />

            {/* Studio Voiceover Track */}
            <Audio src={staticFile(`vo/${id}.mp3`)} volume={1.0} />

            {/* Cinematic Sound FX Anchors */}
            {id === "hook" && (
              <Sequence from={510} durationInFrames={75} name="sfx-cartridge-click">
                <Audio src={staticFile("sfx/cartridge_click.mp3")} volume={0.8} />
              </Sequence>
            )}

            {id === "revenue" && (
              <Sequence from={230} durationInFrames={90} name="sfx-monad-cash">
                <Audio src={staticFile("sfx/monad_cash.mp3")} volume={0.85} />
              </Sequence>
            )}

            {id === "wave" && (
              <Sequence from={630} durationInFrames={60} name="sfx-near-miss-spark">
                <Audio src={staticFile("sfx/near_miss_spark.mp3")} volume={0.9} />
              </Sequence>
            )}

            {id === "social" && (
              <Sequence from={710} durationInFrames={108} name="sfx-jailbreak-alarm">
                <Audio src={staticFile("sfx/alarm_refusal.mp3")} volume={0.75} />
              </Sequence>
            )}

            {id === "ablation" && (
              <>
                <Sequence from={100} durationInFrames={72} name="sfx-cartridge-eject">
                  <Audio src={staticFile("sfx/eject_whoosh.mp3")} volume={0.85} />
                </Sequence>
                <Sequence from={130} durationInFrames={108} name="sfx-ablation-alarm">
                  <Audio src={staticFile("sfx/alarm_refusal.mp3")} volume={0.8} />
                </Sequence>
                <Sequence from={670} durationInFrames={72} name="sfx-cartridge-reinsert">
                  <Audio src={staticFile("sfx/cartridge_click.mp3")} volume={0.85} />
                </Sequence>
              </>
            )}
          </Sequence>
        );
      })}

      {/* Global High-Contrast Professional Captions Overlay */}
      <Captions />
    </AbsoluteFill>
  );
};

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="InsideChogDemo"
      component={InsideChogVideo}
      durationInFrames={TOTAL_FRAMES}
      fps={FPS}
      width={WIDTH}
      height={HEIGHT}
    />
  );
};
