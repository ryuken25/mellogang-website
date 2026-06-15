/**
 * Choreography untuk MellogangPromo.
 * Frame numbers = frame LOKAL (offset Sequence) di BookingsScene.
 * Koordinat di canvas 1920x1080.
 */
export type CursorKey = {
  frame: number;
  x: number;
  y: number;
  click?: boolean;
  /** label yang muncul saat cursor tiba di sini */
  caption?: string;
};

export const CURSOR_PATH: CursorKey[] = [
  { frame: 0,   x: 1640, y: 980 },               // enter, bottom-right
  { frame: 60,  x: 1640, y: 980 },               // idle — biar reveal settle
  { frame: 160, x: 560,  y: 380 },               // → Card A
  { frame: 280, x: 560,  y: 380, caption: "Pesanan kamu, satu layar." }, // hover-hold A
  { frame: 380, x: 1180, y: 300, caption: "Status real-time." },       // → Status pill B
  { frame: 520, x: 1180, y: 300 },               // hold (dot pulses)
  { frame: 640, x: 600,  y: 600, click: true, caption: "Bayar atau lacak - sekali klik." }, // → CTA on C, CLICK
  { frame: 760, x: 600,  y: 600 },               // settle after click
];

export const HOVER = {
  cardA:   [200, 380] as [number, number],
  statusB: [430, 590] as [number, number],
  ctaC:    [620, 760] as [number, number],
};

export const inWindow = (f: number, [a, b]: [number, number]): boolean =>
  f >= a && f <= b;

/**
 * Scene timings (all in frames @ 60fps). Intro 4s, Bookings 26s,
 * Outro 6s. TransitionSeries overlap = 18 frames, 12 frames, 18 frames.
 */
export const TIMING = {
  intro: 240,
  bookings: 1560,
  outro: 360,
  transitionFade: 18,
};

/**
 * Total composed duration (sum minus transitions).
 * = 240 + 1560 + 360 - 18 - 12 = 2130 frames @ 60fps = 35.5s
 */
export const TOTAL_FRAMES = 2130;
