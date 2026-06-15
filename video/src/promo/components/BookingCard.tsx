import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { THEME, grotesk, inter, SPRING_SMOOTH } from "../theme";
import { inWindow } from "../choreography";

const Meta: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div>
    <div
      style={{
        fontSize: 11,
        letterSpacing: 1.5,
        color: THEME.muted,
        marginBottom: 6,
        fontFamily: grotesk,
        fontWeight: 700,
        textTransform: "uppercase",
      }}
    >
      {label}
    </div>
    <div style={{ fontSize: 18, fontVariantNumeric: "tabular-nums" }}>{value}</div>
  </div>
);

export const BookingCard: React.FC<{
  index: number;
  revealAt: number;
  hoverWindow: [number, number];
  code: string;
  title: string;
  date: string;
  price: string;
  children?: React.ReactNode;
  /** absolute position of the bottom-right track-link */
  trackCenterX: number;
  trackCenterY: number;
  /** CTA element to render (the TrackLink lives in the same card) */
  cta?: React.ReactNode;
}> = ({ index, revealAt, hoverWindow, code, title, date, price, children, cta }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const reveal = spring({
    frame: frame - revealAt - index * 8,
    fps,
    config: SPRING_SMOOTH,
  });
  const opacity = interpolate(reveal, [0, 1], [0, 1]);
  const enterY = interpolate(reveal, [0, 1], [24, 0]);

  const hovered = inWindow(frame, hoverWindow);
  const hp = hovered
    ? interpolate(frame - hoverWindow[0], [0, 12], [0, 1], {
        extrapolateRight: "clamp",
      })
    : 0;
  const lift = interpolate(hp, [0, 1], [0, -8]);
  const glow = interpolate(hp, [0, 1], [0, 1]);

  return (
    <div
      style={{
        opacity,
        transform: `translateY(${enterY + lift}px)`,
        background: THEME.surface,
        borderRadius: THEME.radius,
        border: `1px solid ${hovered ? THEME.borderHover : THEME.border}`,
        boxShadow: `0 ${20 * glow}px ${60 * glow}px -20px rgba(0,245,184,${0.18 * glow})`,
        padding: "28px 32px",
        width: 520,
        fontFamily: inter,
        color: THEME.text,
        position: "relative",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span
          style={{
            fontFamily: inter,
            fontVariantNumeric: "tabular-nums",
            letterSpacing: 1,
            fontSize: 13,
            color: THEME.muted,
          }}
        >
          {code}
        </span>
        {children}
      </div>

      <h3
        style={{
          fontFamily: grotesk,
          fontSize: 30,
          margin: "18px 0 22px",
          letterSpacing: -0.5,
          lineHeight: 1.15,
        }}
      >
        {title}
      </h3>

      <div style={{ display: "flex", gap: 48 }}>
        <Meta label="Event date" value={date} />
        <Meta label="Total" value={price} />
      </div>

      {cta && (
        <div style={{ marginTop: 24 }}>{cta}</div>
      )}
    </div>
  );
};
