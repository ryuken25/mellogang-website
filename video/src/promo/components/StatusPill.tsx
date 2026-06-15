import { useCurrentFrame } from "remotion";
import { THEME } from "../theme";

export const StatusPill: React.FC<{
  state: "awaiting" | "processing";
  label: string;
}> = ({ state, label }) => {
  const frame = useCurrentFrame();
  const color = state === "awaiting" ? THEME.amber : THEME.teal;

  const pulse =
    state === "awaiting"
      ? // ring oscillates 0-6px @ ~2s period
        (Math.sin(frame / 9) + 1) * 3
      : 0;

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        color,
        fontSize: 13,
        fontWeight: 600,
        fontFamily: "Inter, system-ui, sans-serif",
        letterSpacing: 0.3,
        padding: "6px 12px 6px 10px",
        borderRadius: 999,
        background: `${color}14`,
        border: `1px solid ${color}33`,
      }}
    >
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: color,
          boxShadow: `0 0 0 ${pulse}px ${color}33`,
        }}
      />
      {label}
    </span>
  );
};
