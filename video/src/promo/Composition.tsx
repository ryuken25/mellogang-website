import { AbsoluteFill } from "remotion";
import {
  TransitionSeries,
  linearTiming,
  springTiming,
} from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { THEME, FPS } from "./theme";
import { TIMING, TOTAL_FRAMES } from "./choreography";
import { IntroScene } from "./scenes/IntroScene";
import { BookingsScene } from "./scenes/BookingsScene";
import { OutroScene } from "./scenes/OutroScene";
import { Grain } from "./components/Grain";

export const MellogangPromo: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: THEME.bg }}>
    <TransitionSeries>
      <TransitionSeries.Sequence durationInFrames={TIMING.intro}>
        <IntroScene />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={fade()}
        timing={springTiming({ config: { damping: 200 } })}
      />
      <TransitionSeries.Sequence durationInFrames={TIMING.bookings}>
        <BookingsScene />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: TIMING.transitionFade })}
      />
      <TransitionSeries.Sequence durationInFrames={TIMING.outro}>
        <OutroScene />
      </TransitionSeries.Sequence>
    </TransitionSeries>
    <Grain />
  </AbsoluteFill>
);

export { TOTAL_FRAMES, FPS };
