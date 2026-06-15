import { AbsoluteFill } from "remotion";

/**
 * Subtle film-grain overlay (cinematic).
 * Inline SVG noise filter at ~5% opacity over the whole frame.
 */
export const Grain: React.FC = () => (
  <AbsoluteFill
    style={{
      pointerEvents: "none",
      mixBlendMode: "overlay",
      opacity: 0.05,
      zIndex: 999,
    }}
  >
    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <filter id="grain-noise">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.9"
          numOctaves="2"
          stitchTiles="stitch"
        />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#grain-noise)" />
    </svg>
  </AbsoluteFill>
);
