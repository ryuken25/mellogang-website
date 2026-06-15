import { interpolate, useCurrentFrame } from "remotion";
import { useCursor } from "../hooks/useCursor";
import { CURSOR_PATH, inWindow, HOVER } from "../choreography";
import { THEME, grotesk } from "../theme";

/**
 * Magnetic CTA — pulls toward the cursor during HOVER.ctaC window.
 * Arrow slides +6px, underline draws in scaleX 0->1.
 */
export const TrackLink: React.FC = () => {
  const frame = useCurrentFrame();
  const { x: cx, y: cy } = useCursor(CURSOR_PATH);
  const active = inWindow(frame, HOVER.ctaC);

  // Magnetic factor
  const k = active ? 0.18 : 0;
  // We center the magnetic calculation around our visual position
  // (the cursor is already in canvas coords; our element is too).
  // We use transform-origin at the element's position via the parent.
  // Simplest: read transform from the parent via a ref-less approach.
  // Since the parent positions us, we just use the cursor position
  // directly to compute offset.
  const dx = (cx - 600) * k; // 600 = the CURSOR_PATH click x for cardC
  const dy = (cy - 600) * k; // 600 = the y

  const under = active
    ? interpolate(frame - HOVER.ctaC[0], [0, 14], [0, 1], {
        extrapolateRight: "clamp",
      })
    : 0;
  const arrow = active
    ? interpolate(frame - HOVER.ctaC[0], [0, 14], [0, 6], {
        extrapolateRight: "clamp",
      })
    : 0;

  return (
    <div
      style={{
        position: "relative",
        display: "inline-flex",
        gap: 10,
        alignItems: "center",
        transform: `translate(${dx}px, ${dy}px)`,
        color: THEME.teal,
        fontFamily: grotesk,
        fontSize: 16,
        fontWeight: 600,
        letterSpacing: 0.4,
      }}
    >
      <span>Bayar atau lacak</span>
      <span style={{ transform: `translateX(${arrow}px)`, display: "inline-block" }}>
        →
      </span>
      <span
        style={{
          position: "absolute",
          left: 0,
          bottom: -3,
          height: 1,
          width: "100%",
          background: "currentColor",
          transform: `scaleX(${under})`,
          transformOrigin: "left",
        }}
      />
    </div>
  );
};
