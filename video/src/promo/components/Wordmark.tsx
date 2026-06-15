import { interpolate, useCurrentFrame } from "remotion";
import { grotesk, THEME } from "../theme";

/**
 * "Mellogang Visuals" wordmark with a teal accent line that draws in.
 * Reveal: clip-path inset 100% 0 0 0 → inset 0 0 0 0 over 36 frames.
 */
export const Wordmark: React.FC<{
  showFrom: number;
  size?: number;
  showLine?: boolean;
}> = ({ showFrom, size = 96, showLine = true }) => {
  const frame = useCurrentFrame();
  const elapsed = frame - showFrom;

  const reveal = interpolate(elapsed, [0, 36], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const opacity = interpolate(reveal, [0, 0.4], [0, 1], {
    extrapolateRight: "clamp",
  });
  const lineWidth = interpolate(elapsed, [24, 60], [0, 220], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const tagOpacity = interpolate(elapsed, [40, 70], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "relative",
        display: "inline-block",
        opacity,
      }}
    >
      <div
        style={{
          fontFamily: grotesk,
          fontWeight: 800,
          fontSize: size,
          color: THEME.text,
          letterSpacing: -0.04 * size,
          lineHeight: 1,
          whiteSpace: "nowrap",
          clipPath: `inset(0 ${(1 - reveal) * 100}% 0 0)`,
        }}
      >
        Mellogang Visuals
      </div>
      {showLine && (
        <div
          style={{
            height: 3,
            width: lineWidth,
            background: THEME.teal,
            marginTop: 14,
            transformOrigin: "left",
            boxShadow: `0 0 24px ${THEME.teal}`,
          }}
        />
      )}
      <div
        style={{
          marginTop: 20,
          color: THEME.muted,
          fontFamily: grotesk,
          fontSize: 18,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          opacity: tagOpacity,
        }}
      >
        Photo &amp; Video Maker - 2026
      </div>
    </div>
  );
};
