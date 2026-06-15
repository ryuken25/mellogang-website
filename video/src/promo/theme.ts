/**
 * Brand tokens untuk MellogangPromo Remotion project.
 * Senada dengan app.css di CodeIgniter app.
 */
import { loadFont as loadGrotesk } from "@remotion/google-fonts/SpaceGrotesk";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

export const FPS = 60;

export const THEME = {
  bg: "#0A0C0B",
  surface: "rgba(255,255,255,0.02)",
  border: "rgba(255,255,255,0.06)",
  borderHover: "rgba(0,245,184,0.35)",
  teal: "#00F5B8",
  amber: "#FFB749",
  red: "#FF5C6C",
  text: "#EDEDED",
  muted: "rgba(237,237,237,0.55)",
  mutedStrong: "rgba(237,237,237,0.75)",
  radius: 16,
} as const;

// Spring presets — settled arrivals, little/no overshoot
export const SPRING_SMOOTH = { damping: 26, stiffness: 90,  mass: 1 };
export const SPRING_SOFT   = { damping: 32, stiffness: 120, mass: 1 };
export const SPRING_FIRM   = { damping: 20, stiffness: 160, mass: 1 };

// Fonts (self-hosted via @remotion/google-fonts, render-safe)
export const grotesk = loadGrotesk().fontFamily;
export const inter   = loadInter().fontFamily;
