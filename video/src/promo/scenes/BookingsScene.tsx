import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { THEME, grotesk, inter } from "../theme";
import { HOVER, CURSOR_PATH } from "../choreography";
import { BookingCard } from "../components/BookingCard";
import { StatusPill } from "../components/StatusPill";
import { TrackLink } from "../components/TrackLink";
import { Cursor } from "../components/Cursor";
import { Caption } from "../components/Caption";

/**
 * BookingsScene — the A → B → C cursor choreography.
 *
 * Card positions (canvas 1920x1080):
 *   Card A: top-left, x=200,  y=240
 *   Card B: top-right, x=1100, y=170
 *   Card C (link only): mid-left, x=200, y=560
 */
export const BookingsScene: React.FC = () => {
  const frame = useCurrentFrame();

  // After the click ripple (frame 640+18), the confirmation card slides
  // up from below + soft scale-in.
  const confOp = interpolate(frame, [700, 740], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const confY = interpolate(frame, [700, 760], [40, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const confScale = interpolate(frame, [700, 760], [0.96, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ background: THEME.bg }}>
      {/* Section label (top-left) */}
      <div
        style={{
          position: "absolute",
          top: 60,
          left: 80,
          fontFamily: grotesk,
          fontSize: 13,
          fontWeight: 700,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: THEME.teal,
        }}
      >
        Pesanan kamu
      </div>

      {/* Top-right tag */}
      <div
        style={{
          position: "absolute",
          top: 60,
          right: 80,
          fontFamily: grotesk,
          fontSize: 12,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: THEME.muted,
        }}
      >
        Mellogang Visuals - Customer dashboard
      </div>

      {/* Card A (top-left) */}
      <div style={{ position: "absolute", left: 200, top: 240 }}>
        <BookingCard
          index={0}
          revealAt={60}
          hoverWindow={HOVER.cardA}
          code="MLG260614-0004"
          title="Corporate Profile Mini"
          date="23 Jun 2026"
          price="Rp 2.000.000"
          trackCenterX={600}
          trackCenterY={600}
        >
          <StatusPill state="processing" label="Sedang dikerjakan" />
        </BookingCard>
      </div>

      {/* Card B (top-right) */}
      <div style={{ position: "absolute", left: 1100, top: 170 }}>
        <BookingCard
          index={1}
          revealAt={140}
          hoverWindow={HOVER.statusB}
          code="MLG260614-0001"
          title="Basic Reels"
          date="20 Jun 2026"
          price="Rp 1.000.000"
          trackCenterX={600}
          trackCenterY={600}
        >
          <StatusPill state="awaiting" label="Menunggu pembayaran" />
        </BookingCard>
      </div>

      {/* Card C (bottom-left) — track link only (no full card) */}
      <div
        style={{
          position: "absolute",
          left: 200,
          top: 600,
        }}
      >
        <BookingCard
          index={2}
          revealAt={260}
          hoverWindow={HOVER.ctaC}
          code="MLG260614-0007"
          title="Wedding Highlight Teaser"
          date="15 Jul 2026"
          price="Rp 3.000.000"
          trackCenterX={600}
          trackCenterY={600}
          cta={<TrackLink />}
        >
          <StatusPill state="awaiting" label="Menunggu pembayaran" />
        </BookingCard>
      </div>

      {/* Confirmation card (fades in after click) */}
      <div
        style={{
          position: "absolute",
          left: 1100,
          top: 720,
          opacity: confOp,
          transform: `translateY(${confY}px) scale(${confScale})`,
          background: THEME.surface,
          border: `1px solid ${THEME.teal}55`,
          boxShadow: `0 20px 60px -20px rgba(0,245,184,0.25)`,
          borderRadius: 16,
          padding: "24px 28px",
          width: 520,
          fontFamily: inter,
          color: THEME.text,
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            color: THEME.teal,
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            marginBottom: 14,
          }}
        >
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: THEME.teal,
              boxShadow: `0 0 0 4px ${THEME.teal}33`,
            }}
          />
          Pembayaran diterima
        </div>
        <div style={{ fontFamily: grotesk, fontSize: 22, fontWeight: 700, marginBottom: 4 }}>
          Produksi sudah dijadwalkan
        </div>
        <div style={{ color: THEME.muted, fontSize: 14 }}>
          Editor akan menghubungi kamu untuk detail shooting.
        </div>
      </div>

      {/* Captions (synced to cursor arrival on each target) */}
      <Caption
        text="Pesanan kamu, satu layar."
        showFrom={150}
        showTo={360}
      />
      <Caption
        text="Status real-time."
        showFrom={380}
        showTo={600}
      />
      <Caption
        text="Bayar atau lacak - sekali klik."
        showFrom={620}
        showTo={900}
      />

      {/* Cursor on top */}
      <Cursor />
    </AbsoluteFill>
  );
};
