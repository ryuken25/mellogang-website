import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { grotesk, THEME } from "../theme";
import { Wordmark } from "../components/Wordmark";

export const OutroScene: React.FC = () => {
  const frame = useCurrentFrame();

  const ctaOp = interpolate(frame, [60, 100], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const ctaY = interpolate(frame, [60, 100], [10, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const urlOp = interpolate(frame, [140, 180], [0, 1], {
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
          left: "20%",
          top: "20%",
          width: "70%",
          height: "60%",
          background:
            "radial-gradient(ellipse, rgba(0,245,184,0.18) 0%, transparent 60%)",
        }}
      />

      <Wordmark showFrom={0} size={108} />

      <div
        style={{
          marginTop: 50,
          opacity: ctaOp,
          transform: `translateY(${ctaY}px)`,
        }}
      >
        <div
          style={{
            display: "inline-block",
            padding: "20px 40px",
            background: THEME.teal,
            color: THEME.bg,
            borderRadius: 999,
            fontFamily: grotesk,
            fontSize: 22,
            fontWeight: 700,
            letterSpacing: 0.5,
            boxShadow: "0 0 60px rgba(0,245,184,0.4)",
          }}
        >
          Mulai sekarang
        </div>
      </div>

      <div
        style={{
          marginTop: 30,
          fontFamily: grotesk,
          fontSize: 14,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: THEME.muted,
          opacity: urlOp,
        }}
      >
        mellogang.test  -  instagram  -  youtube
      </div>
    </AbsoluteFill>
  );
};
