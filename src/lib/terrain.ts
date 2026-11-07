import {seeded} from './math';

/**
 * The hero landscape is drawn, not photographed: every layer is an SVG path
 * generated from a fixed seed, so it is pin-sharp on any screen density and
 * costs a few kilobytes instead of megabytes of layered renders.
 *
 * All layers share one 1600×1000 canvas and the same `xMidYMax slice` fit,
 * so they stay registered at every viewport, landscape or portrait.
 */
export const W = 1600;
export const H = 1000;

type Pt = [number, number];

/** Midpoint displacement between fixed anchor points: natural, jagged ridgelines. */
export function ridge(seed: number, anchors: Pt[], roughness: number, depth = 6): Pt[] {
  const rand = seeded(seed);
  let pts = anchors.slice();
  let amp = roughness;
  for (let d = 0; d < depth; d++) {
    const next: Pt[] = [];
    for (let i = 0; i < pts.length - 1; i++) {
      const [x1, y1] = pts[i];
      const [x2, y2] = pts[i + 1];
      next.push(pts[i]);
      const span = Math.abs(x2 - x1);
      next.push([(x1 + x2) / 2, (y1 + y2) / 2 + (rand() - 0.5) * amp * span]);
    }
    next.push(pts[pts.length - 1]);
    pts = next;
    amp *= 0.62;
  }
  return pts;
}

const f = (n: number) => Math.round(n * 10) / 10;

/** A ridgeline closed down to the bottom of the canvas (or a given floor). */
export function fill(pts: Pt[], floor = H + 40): string {
  const [x0] = pts[0];
  const [xn] = pts[pts.length - 1];
  return `M${f(x0)} ${floor} ${pts.map(([x, y]) => `L${f(x)} ${f(y)}`).join(' ')} L${f(xn)} ${floor} Z`;
}

/** Just the line, for rim light along a ridge. */
export function line(pts: Pt[]): string {
  return pts.map(([x, y], i) => `${i ? 'L' : 'M'}${f(x)} ${f(y)}`).join(' ');
}

/** A deodar: the tiered cedar of the Kashmir valley, as a silhouette. */
export function deodar(x: number, base: number, h: number, seed: number): string {
  const rand = seeded(seed);
  const tiers = 6;
  const parts: string[] = [`M${f(x - h * 0.02)} ${f(base)} L${f(x - h * 0.02)} ${f(base - h * 0.12)} L${f(x + h * 0.02)} ${f(base - h * 0.12)} L${f(x + h * 0.02)} ${f(base)} Z`];
  for (let t = 0; t < tiers; t++) {
    const k = t / tiers;
    const y = base - h * 0.1 - k * h * 0.86;
    const w = h * (0.34 - k * 0.27) * (0.9 + rand() * 0.2);
    const th = h * 0.24;
    const droop = h * 0.035;
    parts.push(`M${f(x)} ${f(y - th)} L${f(x + w)} ${f(y + droop)} L${f(x - w)} ${f(y + droop)} Z`);
  }
  return parts.join(' ');
}

/** Stars for the sky layer. */
export function stars(seed: number, count: number, maxY: number) {
  const rand = seeded(seed);
  return Array.from({length: count}, () => ({
    x: f(rand() * W),
    y: f(rand() * maxY),
    r: rand() < 0.08 ? 1.6 : 0.55 + rand() * 0.6,
    o: 0.25 + rand() * 0.6,
  }));
}
