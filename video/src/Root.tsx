import { Composition } from "remotion";
import { showcaseReelConfig, ShowcaseReel } from "./compositions/ShowcaseReel";
import { Opening, Closing } from "./compositions/Bookends";
import { bookend, width, height, fps } from "./theme";
import { MellogangPromo, TOTAL_FRAMES } from "./promo/Composition";
import { FPS as PROMO_FPS } from "./promo/theme";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* Existing showcase reel (page-tour) */}
      <Composition
        id="ShowcaseReel"
        component={ShowcaseReel}
        durationInFrames={showcaseReelConfig.durationInFrames}
        fps={fps}
        width={width}
        height={height}
      />
      <Composition
        id="Opening"
        component={Opening}
        durationInFrames={bookend.durationInFrames}
        fps={fps}
        width={width}
        height={height}
      />
      <Composition
        id="Closing"
        component={Closing}
        durationInFrames={bookend.durationInFrames}
        fps={fps}
        width={width}
        height={height}
      />

      {/* New promo — choreographed cursor (16:9 + 9:16 variants) */}
      <Composition
        id="MellogangPromo"
        component={MellogangPromo}
        durationInFrames={TOTAL_FRAMES}
        fps={PROMO_FPS}
        width={1920}
        height={1080}
      />
      <Composition
        id="MellogangPromoVertical"
        component={MellogangPromo}
        durationInFrames={TOTAL_FRAMES}
        fps={PROMO_FPS}
        width={1080}
        height={1920}
      />
    </>
  );
};
