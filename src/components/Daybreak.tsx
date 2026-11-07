import {useEffect, useMemo, useRef, useState, type ReactNode} from 'react';
import {hero} from '../content';
import {useReducedMotion} from '../hooks/useReducedMotion';
import {studioTime} from '../hooks/useStudioClock';
import {clamp, easeOutCubic, lerp, pinProgress, range} from '../lib/math';
import {onFrame} from '../lib/scroll';
import {H, W, deodar, fill, line, ridge, stars} from '../lib/terrain';

/**
 * Daybreak over the valley. Six drawn layers, stacked and pinned; one scroll
 * range moves each at its own rate (the same choreography as the SELENE
 * Earthrise, re-cut for Kavriqon):
 *
 *   0.00 – 0.18  a veil of valley mist drifts off the lens
 *   0.04 – 0.50  the sun climbs out from behind the ridge and the sky warms
 *   0.08 – 0.50  KAVRIQON resolves between the far peaks and the valley walls
 *   0.28 – 0.60  the valley walls close in around the view — you're standing
 *                in the valley looking out — and the figure and ground rise
 *   0.70 – 1.00  everything tilts away upward and the ground swallows the
 *                frame to black, which is where the page continues
 *
 * A thin telemetry HUD rides on top: the studio clock in Srinagar, the sun's
 * elevation above the ridge, and the studio's coordinates.
 */

const STAGE_VH = 440;

type LayerName = 'sky' | 'sun' | 'range' | 'frame' | 'figure' | 'ground';

/** Landscape and portrait cuts of the same drawing (the vector `d` and `m`). */
const VIEW = {d: `0 0 ${W} ${H}`, m: `420 0 760 ${H}`};

type Mote = {x: number; y: number; r: number; s: number; a: number};

function usePortrait() {
  const q = '(max-aspect-ratio: 1/1)';
  const [portrait, set] = useState(() => typeof window !== 'undefined' && window.matchMedia(q).matches);
  useEffect(() => {
    const mq = window.matchMedia(q);
    const on = () => set(mq.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  return portrait;
}

/** Every path in the scene, generated once from fixed seeds. */
function useScene() {
  return useMemo(() => {
    const far = ridge(7, [[0, 600], [170, 470], [350, 372], [540, 505], [700, 432], [850, 600], [960, 646], [1070, 566], [1240, 392], [1420, 476], [1600, 560]], 0.2, 7);
    const mid = ridge(19, [[0, 730], [280, 662], [600, 712], [900, 700], [1210, 648], [1600, 716]], 0.12, 6);
    const leftWall = ridge(31, [[-40, 150], [190, 410], [360, 690], [520, 1040]], 0.16, 6);
    const rightWall = ridge(43, [[1640, 250], [1410, 470], [1210, 760], [1090, 1040]], 0.16, 6);
    const ground = ridge(57, [[0, 772], [210, 800], [430, 852], [640, 852], [770, 846], [910, 856], [1110, 864], [1320, 820], [1600, 786]], 0.06, 6);
    const groundAt = (x: number) => {
      for (let i = 0; i < ground.length - 1; i++) if (ground[i + 1][0] >= x) return ground[i][1];
      return ground[ground.length - 1][1];
    };
    const trees = [
      [40, 250], [118, 205], [190, 262], [262, 186], [330, 228], [410, 160], [470, 120], [540, 96],
      [1060, 92], [1130, 130], [1200, 176], [1270, 230], [1350, 196], [1430, 262], [1500, 214], [1575, 246],
    ].map(([x, h], i) => deodar(x, groundAt(x) + 14, h, 100 + i));

    return {
      far: fill(far),
      farLine: line(far),
      mid: fill(mid),
      leftWall: `M-60 -60 ${line(leftWall).replace('M', 'L')} L-60 1100 Z`,
      leftRim: line(leftWall),
      rightWall: `M1660 -60 ${line(rightWall).replace('M', 'L')} L1660 1100 Z`,
      rightRim: line(rightWall),
      ground: fill(ground),
      trees: trees.join(' '),
      stars: stars(3, 190, 560),
    };
  }, []);
}

export function Daybreak() {
  const rootRef = useRef<HTMLElement>(null);
  const layerRefs = useRef<Partial<Record<LayerName, HTMLDivElement>>>({});
  const dawnRef = useRef<SVGGElement>(null);
  const veilRef = useRef<HTMLDivElement>(null);
  const dustRef = useRef<HTMLCanvasElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const hudRef = useRef<HTMLDivElement>(null);
  const clockRef = useRef<HTMLParagraphElement>(null);
  const elevRef = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();
  const reducedRef = useRef(reduced);
  reducedRef.current = reduced;
  const portrait = usePortrait();
  const scene = useScene();
  const view = portrait ? VIEW.m : VIEW.d;

  // Mist canvas size.
  useEffect(() => {
    const c = dustRef.current!;
    const sync = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      c.width = Math.round(c.clientWidth * dpr);
      c.height = Math.round(c.clientHeight * dpr);
    };
    sync();
    const ro = new ResizeObserver(sync);
    ro.observe(c);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const canvas = dustRef.current!;
    const ctx = canvas.getContext('2d')!;
    let seed = 11;
    const rand = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
    const motes: Mote[] = Array.from({length: 150}, () => ({x: rand(), y: rand(), r: 0.4 + rand() * 1.8, s: 0.3 + rand(), a: 0.2 + rand() * 0.6}));
    let lastP = -1;
    let lastTime = 0;
    let lastClock = '';

    const set = (name: LayerName, y: number, scale = 1, opacity = 1) => {
      const el = layerRefs.current[name];
      if (!el) return;
      el.style.transform = `translate3d(0, ${y}vh, 0) scale(${scale})`;
      el.style.opacity = String(opacity);
    };

    return onFrame((time) => {
      const dt = lastTime ? Math.min(0.1, (time - lastTime) / 1000) : 1 / 60;
      lastTime = time;
      const root = rootRef.current;
      if (!root) return;
      const {p: scrolled, rect} = pinProgress(root);
      if (rect.bottom < 0) return;

      // Studio clock, once a second.
      const clock = studioTime();
      if (clock !== lastClock) {
        lastClock = clock;
        clockRef.current!.textContent = `IST ${clock}`;
      }

      // Reduce Motion: no pinned journey, just the finished view, held still.
      if (reducedRef.current) {
        if (lastP === -2) return;
        lastP = -2;
        (['sky', 'sun', 'range', 'frame', 'figure', 'ground'] as LayerName[]).forEach((n) => set(n, 0));
        dawnRef.current!.style.opacity = '1';
        veilRef.current!.style.opacity = '0';
        canvas.style.opacity = '0';
        const t = titleRef.current!;
        t.style.opacity = '1';
        t.style.letterSpacing = '0.24em';
        t.style.transform = 'none';
        t.style.filter = '';
        hudRef.current!.style.opacity = '1';
        elevRef.current!.textContent = '12.4°';
        return;
      }
      const p = scrolled;

      // Mist drifts every frame while it's visible.
      const veil = 1 - range(p, 0, 0.18);
      if (veil > 0.001) {
        const w = canvas.clientWidth;
        const h = canvas.clientHeight;
        const dpr = canvas.width / Math.max(1, w);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.clearRect(0, 0, w, h);
        ctx.fillStyle = '#e6ecf5';
        for (const m of motes) {
          m.x += 0.006 * m.s * dt;
          m.y -= 0.004 * m.s * dt;
          if (m.x > 1) m.x -= 1;
          if (m.y < 0) m.y += 1;
          ctx.globalAlpha = m.a * veil;
          ctx.beginPath();
          ctx.arc(m.x * w, (m.y - p * 0.6) * h, m.r * (1 + p * 4), 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.globalAlpha = 1;
      }

      if (Math.abs(p - lastP) < 0.00005) return;
      lastP = p;

      const exit = range(p, 0.7, 1);
      const settle = easeOutCubic(range(p, 0, 0.5));

      // Mist clears upward — fully gone at 0.18, before the sun starts to show.
      veilRef.current!.style.opacity = String(veil);
      veilRef.current!.style.transform = `translate3d(0, ${-range(p, 0, 0.18) * 24}vh, 0) scale(${1 + range(p, 0, 0.18) * 0.25})`;
      canvas.style.opacity = String(veil);

      // Far → near, each faster than the one behind it.
      set('sky', lerp(0, -6, p), lerp(1.14, 1, settle));
      const rise = easeOutCubic(range(p, 0.04, 0.5));
      dawnRef.current!.style.opacity = String(0.25 + rise * 0.75);
      set('sun', lerp(34, 0, rise) - exit * 12, lerp(0.92, 1, rise));
      set('range', lerp(9, 0, settle) - exit * 26);
      const rim = easeOutCubic(range(p, 0.28, 0.58));
      set('frame', -exit * 44, lerp(1.6, 1, rim), rim);
      const up = easeOutCubic(range(p, 0.36, 0.62));
      set('figure', lerp(28, 0, up) - exit * 58, 1, clamp(up * 2));
      const ground = easeOutCubic(range(p, 0.34, 0.6));
      set('ground', lerp(36, 0, ground) - exit * 50);

      // Title: resolves (tracking closes in), then yields to the valley walls.
      const tIn = easeOutCubic(range(p, 0.08, 0.24));
      const tOut = range(p, 0.42, 0.52);
      const title = titleRef.current!;
      title.style.opacity = String(tIn * (1 - tOut));
      title.style.letterSpacing = `${lerp(0.6, 0.24, tIn)}em`;
      title.style.transform = `translate3d(0, ${-p * 6}vh, 0)`;
      title.style.filter = tIn < 0.99 ? `blur(${(1 - tIn) * 10}px)` : '';

      // Telemetry.
      hudRef.current!.style.opacity = String(range(p, 0.02, 0.1) * (1 - range(p, 0.62, 0.72)));
      elevRef.current!.textContent = `${(rise * 12.4).toFixed(1)}°`;
    });
  }, []);

  const layer = (name: LayerName, children: ReactNode, extra = '') => (
    <div
      key={name}
      ref={(el) => {
        if (el) layerRefs.current[name] = el;
      }}
      className={`absolute inset-0 origin-bottom will-change-transform ${extra}`}
    >
      <svg viewBox={view} preserveAspectRatio="xMidYMax slice" className="absolute inset-0 size-full" aria-hidden="true">
        {children}
      </svg>
      {/* The ground carries a black apron below it, so when it climbs it
          fills the screen and hands straight over to the page below. */}
      {name === 'ground' && <div className="absolute inset-x-0 top-full h-[110vh] bg-void" />}
    </div>
  );

  return (
    <section id="top" ref={rootRef} aria-label="Kavriqon Technologies — daybreak over the valley" className="relative" style={{height: reduced ? '100svh' : `${STAGE_VH}svh`}}>
      <div className="sticky top-0 h-screen-s overflow-hidden bg-void">
        <svg width="0" height="0" className="absolute" aria-hidden="true">
          <defs>
            <linearGradient id="sky-night" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#03060b" />
              <stop offset="0.55" stopColor="#0a1424" />
              <stop offset="0.75" stopColor="#172338" />
              <stop offset="1" stopColor="#1d2638" />
            </linearGradient>
            <radialGradient id="sky-dawn">
              <stop offset="0" stopColor="#f0c28c" stopOpacity="0.95" />
              <stop offset="0.35" stopColor="#c27f4f" stopOpacity="0.6" />
              <stop offset="0.7" stopColor="#5a3b45" stopOpacity="0.25" />
              <stop offset="1" stopColor="#1d2638" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="sun-core" cx="0.42" cy="0.4" r="0.6">
              <stop offset="0" stopColor="#fffaf0" />
              <stop offset="0.55" stopColor="#ffe4b8" />
              <stop offset="1" stopColor="#f0b878" />
            </radialGradient>
            <radialGradient id="sun-halo">
              <stop offset="0.2" stopColor="#f6cf98" stopOpacity="0.55" />
              <stop offset="0.5" stopColor="#e0a06a" stopOpacity="0.18" />
              <stop offset="1" stopColor="#e0a06a" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="peaks" x1="0" y1="360" x2="0" y2="660" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#f3e7da" />
              <stop offset="0.22" stopColor="#cfc9cb" />
              <stop offset="0.4" stopColor="#5a6377" />
              <stop offset="0.62" stopColor="#2a3850" />
              <stop offset="1" stopColor="#18233a" />
            </linearGradient>
            <linearGradient id="hills" x1="0" y1="640" x2="0" y2="1000" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#1a2740" />
              <stop offset="1" stopColor="#0b121e" />
            </linearGradient>
            <linearGradient id="haze" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#e9d6c2" stopOpacity="0" />
              <stop offset="0.5" stopColor="#e9d6c2" stopOpacity="0.16" />
              <stop offset="1" stopColor="#e9d6c2" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="wall" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#0f1826" />
              <stop offset="1" stopColor="#070b12" />
            </linearGradient>
          </defs>
        </svg>

        {layer(
          'sky',
          <>
            <rect x="-200" y="-200" width={W + 400} height={H + 400} fill="url(#sky-night)" />
            <g fill="#fff">
              {scene.stars.map((s, i) => (
                <circle key={i} cx={s.x} cy={s.y} r={s.r} opacity={s.o} />
              ))}
            </g>
            <g ref={dawnRef} style={{opacity: 0.25}}>
              <ellipse cx="900" cy="640" rx="980" ry="420" fill="url(#sky-dawn)" />
            </g>
          </>,
        )}
        {layer(
          'sun',
          <>
            <circle cx="900" cy="560" r="300" fill="url(#sun-halo)" />
            <circle cx="900" cy="560" r="64" fill="url(#sun-core)" />
          </>,
        )}
        {layer(
          'range',
          <>
            <path d={scene.far} fill="url(#peaks)" />
            <path d={scene.farLine} fill="none" stroke="#f6d3a6" strokeOpacity="0.55" strokeWidth="1.4" />
            <rect x="0" y="600" width={W} height="170" fill="url(#haze)" />
            <path d={scene.mid} fill="url(#hills)" />
          </>,
        )}

        {/* Title sits between the far peaks and the valley walls. */}
        <div ref={titleRef} className="pointer-events-none absolute inset-x-0 top-[24%] px-4 text-center md:top-[27%]" style={{opacity: 0}}>
          <h1 className="font-display text-hero text-white [text-shadow:0_4px_40px_rgb(0_0_0/0.45)]" style={{marginRight: '-0.24em'}}>
            {hero.title}
          </h1>
          <p className="mt-5 font-display text-[clamp(0.875rem,1.4vw,1.25rem)] tracking-[0.12em] text-snow [text-shadow:0_2px_20px_rgb(0_0_0/0.6)]">{hero.kicker}</p>
        </div>

        {layer(
          'frame',
          <>
            <path d={scene.leftWall} fill="url(#wall)" />
            <path d={scene.leftRim} fill="none" stroke="#e0b98c" strokeOpacity="0.22" strokeWidth="1.5" />
            <path d={scene.rightWall} fill="url(#wall)" />
            <path d={scene.rightRim} fill="none" stroke="#f0c28c" strokeOpacity="0.5" strokeWidth="1.6" />
          </>,
        )}
        {layer(
          'figure',
          <g transform="translate(772 776)">
            {/* The rock, then a lone figure watching the sun come up. */}
            <path d="M-96 64 C-88 22 -52 0 -6 -2 C40 -4 78 16 96 64 Z" fill="#070b12" />
            <path d="M-80 30 C-60 8 -30 0 -6 -2 C30 -4 60 8 80 26" fill="none" stroke="#e0b98c" strokeOpacity="0.35" strokeWidth="1.5" />
            <g transform="translate(0 -2) scale(1.05)">
              <circle cx="0" cy="-92" r="9.5" fill="#05080d" />
              <path
                d="M-5 -82 C-16 -81 -20 -75 -20 -66 L-22 -40 L-18 -38 L-15 -60 L-13 -36 L-12 -1 L-5 -1 L-2 -32 L2 -32 L5 -1 L12 -1 L13 -36 L15 -60 L18 -38 L22 -40 L20 -66 C20 -75 16 -81 5 -82 Z"
                fill="#05080d"
              />
              <path d="M13 -78 C19 -74 20 -68 20.5 -62 M11 -97 C14 -95 15 -90 14 -86" fill="none" stroke="#f0c28c" strokeOpacity="0.7" strokeWidth="1.2" />
            </g>
          </g>,
        )}
        {layer(
          'ground',
          <>
            <path d={scene.ground} fill="#04070b" />
            <path d={scene.trees} fill="#04070b" />
          </>,
        )}

        {/* Valley mist on the lens. */}
        <div
          ref={veilRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(60% 50% at 30% 40%, rgba(200,206,220,0.5), transparent 70%), radial-gradient(50% 60% at 75% 60%, rgba(150,160,185,0.45), transparent 70%), radial-gradient(80% 80% at 50% 50%, rgba(20,26,40,0.85), rgba(5,8,13,0.96))',
          }}
        >
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 px-6 text-center">
            <p className="font-mono text-label text-regolith uppercase">Kavriqon Technologies</p>
            <p className="mt-3 font-display text-[0.8125rem] tracking-[0.5em] text-white uppercase" style={{marginRight: '-0.5em'}}>
              {hero.veil}
            </p>
            <span aria-hidden="true" className="mt-6 inline-block animate-bounce text-regolith motion-reduce:animate-none">
              ↓
            </span>
          </div>
        </div>
        <canvas ref={dustRef} aria-hidden="true" className="pointer-events-none absolute inset-0 size-full" />

        {/* Telemetry HUD. */}
        <div ref={hudRef} aria-hidden="true" className="pointer-events-none absolute inset-4 font-mono text-[0.6875rem] tracking-[0.14em] text-regolith uppercase sm:inset-6 md:text-label" style={{opacity: 0}}>
          <div className="brackets absolute inset-0 text-white/30" />
          <div className="absolute top-16 left-3 space-y-1 md:top-20 md:left-4">
            <p ref={clockRef}>IST 00:00:00</p>
            <p className="text-muted">Studio time</p>
          </div>
          <div className="absolute top-16 right-3 space-y-1 text-right md:top-20 md:right-4">
            <p>
              Sun elev <span ref={elevRef} className="text-bronze">0.0°</span>
            </p>
            <p className="text-muted">Above the ridge</p>
          </div>
          <div className="absolute bottom-3 left-3 max-w-[60%] md:bottom-4 md:left-4">{hero.site}</div>
          <div className="absolute right-3 bottom-3 flex items-center gap-2 md:right-4 md:bottom-4">
            Scroll <span className="inline-block animate-bounce motion-reduce:animate-none">↓</span>
          </div>
        </div>
      </div>
    </section>
  );
}
