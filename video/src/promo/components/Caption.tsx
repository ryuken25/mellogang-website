import { interpolate, useCurrentFrame } from "remotion";
import { grotesk, inter, THEME } from "../theme";

export const Caption: React.FC<{
  text: string;
  showFrom: number;
  showTo: number;
  align?: "left" | "center";
}> = ({ text, showFrom, showTo, align = "left" }) => {
  const frame = useCurrentFrame();
  const visible = frame >= showFrom && frame <= showTo;
  const fadeIn = interpolate(frame, [showFrom, showFrom + 14], [0, 1], {
    extrapolateRight: "clamp",
  });
  const fadeOut = interpolate(frame, [showTo - 14, showTo], [1, 0], {
    extrapolateLeft: "clamp",
  });
  const rise = interpolate(frame, [showFrom, showFrom + 14], [12, 0], {
    extrapolateRight: "clamp",
  });

  if (!visible) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: align === "center" ? 0 : 80,
        right: align === "center" ? 0 : undefined,
        bottom: 110,
        textAlign: align,
        opacity: Math.min(fadeIn, fadeOut),
        transform: `translateY(${rise}px)`,
        color: THEME.mutedStrong,
        fontFamily: inter,
        fontSize: 18,
        letterSpacing: 0.3,
        fontWeight: 400,
        maxWidth: 700,
        zIndex: 5,
      }}
    >
      {text}
    </div>
  );
};
