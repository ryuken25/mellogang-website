import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { THEME, grotesk, inter } from "../theme";
import { Wordmark } from "../components/Wordmark";

export const IntroScene: React.FC = () => {
  const frame = useCurrentFrame();

  // Tagline fades up after wordmark settles
  const tagOp = interpolate(frame, [110, 150], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const tagY = interpolate(frame, [110, 150], [10, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Subtle background sweep
  const sweepX = interpolate(frame, [20, 90], [-300, 2220], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background: THEME.bg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: sweepX,
          top: 0,
          width: 2,
          height: "100%",
          background:
            "linear-gradient(180deg, transparent 0%, #00F5B8 50%, transparent 100%)",
          opacity: 0.35,
        }}
      />

      <div
        style={{
          position: "absolute",
          left: "30%",
          top: "20%",
          width: "60%",
          height: "60%",
          background:
            "radial-gradient(ellipse, rgba(0,245,184,0.18) 0%, transparent 60%)",
        }}
      />

      <div style={{ position: "relative", textAlign: "center" }}>
        <Wordmark showFrom={20} size={108} />
        <div
          style={{
            marginTop: 36,
            fontFamily: inter,
            fontSize: 22,
            color: THEME.mutedStrong,
            letterSpacing: 0.4,
            opacity: tagOp,
            transform: `translateY(${tagY}px)`,
          }}
        >
          Satu sistem. Semua pesanan.
        </div>
      </div>
    </AbsoluteFill>
  );
};
