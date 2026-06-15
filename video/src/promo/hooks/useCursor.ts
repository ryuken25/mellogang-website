/**
 * Cursor engine — semua motion adalah pure function of useCurrentFrame().
 * Tidak ada CSS transition / setTimeout / RAF. Remotion-safe.
 */
import {
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { CursorKey } from "../choreography";
import { SPRING_SMOOTH } from "../theme";

export function useCursor(path: CursorKey[]) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Locate active segment
  let from = path[0];
  let to = path[path.length - 1];
  for (let i = 0; i < path.length - 1; i++) {
    if (frame >= path[i].frame && frame <= path[i + 1].frame) {
      from = path[i];
      to = path[i + 1];
      break;
    }
  }

  const seg = Math.max(1, to.frame - from.frame);
  const p = spring({
    frame: frame - from.frame,
    fps,
    config: SPRING_SMOOTH,
    durationInFrames: seg,
  });

  let x = interpolate(p, [0, 1], [from.x, to.x]);
  let y = interpolate(p, [0, 1], [from.y, to.y]);

  // Idle micro-motion on hold segments (prevents "frozen" feel)
  const isHold =
    Math.abs(from.x - to.x) < 2 && Math.abs(from.y - to.y) < 2;
  if (isHold) {
    x += Math.sin(frame / 14) * 1.5;
    y += Math.cos(frame / 16) * 1.5;
  }

  // Click ripple — 18 frames after any keyframe with click:true
  const clickKey = [...path]
    .reverse()
    .find((k) => k.click && frame >= k.frame && frame <= k.frame + 18);
  const clickProgress =
    clickKey !== undefined
      ? interpolate(frame, [clickKey.frame, clickKey.frame + 18], [0, 1], {
          extrapolateRight: "clamp",
        })
      : null;

  // Active caption (if any)
  const capKey = [...path]
    .reverse()
    .find(
      (k) =>
        k.caption &&
        frame >= k.frame &&
        frame <= k.frame + 90
    );
  const caption = capKey?.caption;
  const captionProgress =
    capKey !== undefined
      ? interpolate(frame, [capKey.frame, capKey.frame + 12, capKey.frame + 78, capKey.frame + 90], [0, 1, 1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      : 0;

  return { x, y, clickProgress, caption, captionProgress };
}
