import { AbsoluteFill } from "remotion";
import { useCursor } from "../hooks/useCursor";
import { CURSOR_PATH } from "../choreography";
import { THEME } from "../theme";

export const Cursor: React.FC = () => {
  const { x, y, clickProgress } = useCursor(CURSOR_PATH);
  const press = clickProgress !== null ? 1 - 0.12 * clickProgress : 1;

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {clickProgress !== null && (
        <div
          style={{
            position: "absolute",
            left: x,
            top: y,
            width: 0,
            height: 0,
            borderRadius: "50%",
            transform: "translate(-50%,-50%)",
            boxShadow: `0 0 0 ${22 * clickProgress}px rgba(0,245,184,0.14)`,
            opacity: 1 - clickProgress,
            pointerEvents: "none",
          }}
        />
      )}
      <svg
        width={30}
        height={30}
        viewBox="0 0 24 24"
        style={{
          position: "absolute",
          left: x,
          top: y,
          transform: `translate(-2px,-2px) scale(${press})`,
          filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.55))",
        }}
      >
        <path
          d="M5 3l14 7-6 2-2 6-6-15z"
          fill="#fff"
          stroke={THEME.bg}
          strokeWidth="1.2"
        />
      </svg>
    </AbsoluteFill>
  );
};
