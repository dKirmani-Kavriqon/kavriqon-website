import {useEffect, useRef, useState} from 'react';
import {process} from '../content';
import {useReducedMotion} from '../hooks/useReducedMotion';
import {clamp, easeOutCubic, lerp, pinProgress, range} from '../lib/math';
import {onFrame} from '../lib/scroll';

/**
 * Idea → Live, drawn as you scroll. The section pins while the four legs of
 * a project ink themselves one after another, a capsule riding the leg being
 * drawn; the typical timeline ticks from week 0 to week 12 during the build,
 * and the last leg — Stay — is an orbit that never closes.
 *
 * Reduce Motion: no pin; the whole route is shown already drawn.
 */

const SECTION_VH = 380;
const WINDOW = [0.06, 0.92] as const;

const IDEA = {cx: 230, cy: 320, r: 84};
const LIVE = {cx: 985, cy: 300, r: 54};

const LEGS = [
  // Discover: a lap and a bit around the idea.
  `M${IDEA.cx} ${IDEA.cy - 124} a124 124 0 1 1 -0.1 0 a124 124 0 0 1 103 55`,
  // Design & build: the long coast.
  `M${IDEA.cx + 103} ${IDEA.cy - 69} C 520 40, 820 70, ${LIVE.cx - 20} ${LIVE.cy - 92}`,
  // Launch: captured into orbit around the live product.
  `M${LIVE.cx - 20} ${LIVE.cy - 92} a94 94 0 1 1 -0.1 0.2 a94 94 0 0 1 20 1`,
  // Stay: the support orbit, closer in, and it keeps going.
  `M${LIVE.cx} ${LIVE.cy - 76} a76 76 0 1 1 -0.1 0`,
];
const LEG_COLOURS = ['#e0b98c', '#6fb6ff', '#e0b98c', '#58c9a0'];

/** Typical project week at a given point along the route (0–4). */
function weekAt(u: number) {
  if (u < 1) return lerp(0, 2, u);
  if (u < 2) return lerp(2, 10, u - 1);
  return lerp(10, 12, clamp(u - 2));
}

export function Process() {
  const reduced = useReducedMotion();
  const rootRef = useRef<HTMLElement>(null);
  const legRefs = useRef<SVGPathElement[]>([]);
  const capsuleRef = useRef<SVGGElement>(null);
  const weekRef = useRef<HTMLSpanElement>(null);
  const orbitRef = useRef<SVGGElement>(null);
  const [leg, setLeg] = useState(0);

  useEffect(() => {
    if (reduced) {
      legRefs.current.forEach((p) => (p.style.strokeDashoffset = '0'));
      capsuleRef.current!.style.opacity = '0';
      orbitRef.current!.style.opacity = '1';
      weekRef.current!.textContent = '12 → ongoing';
      setLeg(3);
      return;
    }
    let lastP = -1;
    let current = 0;
    return onFrame(() => {
      const root = rootRef.current;
      if (!root) return;
      const {p, rect, vh} = pinProgress(root);
      if (rect.bottom < 0 || rect.top > vh) return;
      if (Math.abs(p - lastP) < 0.00005) return;
      lastP = p;

      const u = range(p, ...WINDOW) * LEGS.length;
      const s = clamp(Math.floor(u), 0, LEGS.length - 1);
      if (s !== current) {
        current = s;
        setLeg(s);
      }
      legRefs.current.forEach((path, i) => {
        const k = easeOutCubic(clamp(u - i));
        path.style.strokeDashoffset = String(1 - k);
        if (i === s) {
          const pt = path.getPointAtLength(path.getTotalLength() * k);
          capsuleRef.current!.setAttribute('transform', `translate(${pt.x} ${pt.y})`);
        }
      });
      // Once Stay is drawn, a satellite keeps circling — support never stops.
      const done = range(u, 3.85, 4);
      orbitRef.current!.style.opacity = String(done);
      capsuleRef.current!.style.opacity = String(1 - done);
      weekRef.current!.textContent = u >= 3 ? '12 → ongoing' : String(Math.round(weekAt(u)));
    });
  }, [reduced]);

  const current = process.legs[leg];

  return (
    <section ref={rootRef} id="process" aria-labelledby="process-title" className="relative bg-void" style={{height: reduced ? 'auto' : `${SECTION_VH}svh`}}>
      <div className={`flex flex-col overflow-hidden px-4 pt-20 pb-8 sm:px-6 md:px-[6vw] md:pt-24 ${reduced ? 'min-h-svh py-24' : 'sticky top-0 h-screen-s'}`}>
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-mono text-label text-bronze uppercase">{process.eyebrow}</p>
            <h2 id="process-title" className="mt-3 max-w-[22ch] font-display text-display text-white">
              {process.heading}
            </h2>
          </div>
          <p className="font-mono text-label text-muted uppercase" aria-live="off">
            {process.note} · Week <span ref={weekRef} className="text-white tabular-nums">0</span>
          </p>
        </div>

        <div className="relative flex min-h-0 flex-1 items-center">
          <svg viewBox="0 0 1200 600" className="h-auto max-h-full w-full" role="img" aria-label="A project's route from idea to a live product, drawn in four legs: discover, design and build, launch, and stay.">
            <defs>
              <radialGradient id="idea-shade" cx="35%" cy="32%" r="78%">
                <stop offset="0" stopColor="#fbe7cc" />
                <stop offset="0.45" stopColor="#e0b98c" />
                <stop offset="0.85" stopColor="#7a5232" />
                <stop offset="1" stopColor="#2a1b10" />
              </radialGradient>
              <radialGradient id="idea-glow">
                <stop offset="0.75" stopColor="#e0b98c" stopOpacity="0.32" />
                <stop offset="1" stopColor="#e0b98c" stopOpacity="0" />
              </radialGradient>
              <radialGradient id="live-shade" cx="35%" cy="32%" r="78%">
                <stop offset="0" stopColor="#d9fff0" />
                <stop offset="0.5" stopColor="#58c9a0" />
                <stop offset="1" stopColor="#0f3a2c" />
              </radialGradient>
              <radialGradient id="live-glow">
                <stop offset="0.7" stopColor="#58c9a0" stopOpacity="0.3" />
                <stop offset="1" stopColor="#58c9a0" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Faint star field. */}
            <g fill="#fff">
              {Array.from({length: 70}, (_, i) => (
                <circle key={i} cx={(i * 173) % 1200} cy={(i * 97) % 600} r={i % 7 === 0 ? 1.4 : 0.7} opacity={0.15 + ((i * 37) % 50) / 100} />
              ))}
            </g>

            <circle cx={IDEA.cx} cy={IDEA.cy} r={IDEA.r * 1.22} fill="url(#idea-glow)" />
            <circle cx={IDEA.cx} cy={IDEA.cy} r={IDEA.r} fill="url(#idea-shade)" />
            <circle cx={LIVE.cx} cy={LIVE.cy} r={LIVE.r * 1.3} fill="url(#live-glow)" />
            <circle cx={LIVE.cx} cy={LIVE.cy} r={LIVE.r} fill="url(#live-shade)" />

            {/* Ghost of the full route, then the inked legs over it. */}
            {LEGS.map((d, i) => (
              <path key={`g${i}`} d={d} fill="none" stroke="#fff" strokeOpacity="0.1" strokeWidth="1.5" strokeDasharray="3 6" />
            ))}
            {LEGS.map((d, i) => (
              <path
                key={i}
                ref={(el) => {
                  if (el) legRefs.current[i] = el;
                }}
                d={d}
                pathLength={1}
                fill="none"
                stroke={LEG_COLOURS[i]}
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeDasharray="1 1"
                strokeDashoffset="1"
              />
            ))}

            <g ref={capsuleRef} transform={`translate(${IDEA.cx} ${IDEA.cy - 124})`}>
              <circle r="12" fill="#e0b98c" opacity="0.25" />
              <circle r="5" fill="#fff" />
            </g>
            <g ref={orbitRef} style={{opacity: 0}}>
              <g className="motion-loop" style={{transformOrigin: `${LIVE.cx}px ${LIVE.cy}px`, animation: 'orbit 6s linear infinite'}}>
                <circle cx={LIVE.cx} cy={LIVE.cy - 76} r="11" fill="#58c9a0" opacity="0.25" />
                <circle cx={LIVE.cx} cy={LIVE.cy - 76} r="5" fill="#fff" />
              </g>
            </g>

            <g fontFamily="IBM Plex Mono, monospace" fontSize="14" letterSpacing="2.4" fill="#9ba1ab">
              <text x={IDEA.cx} y={IDEA.cy + IDEA.r + 66} textAnchor="middle">
                YOUR IDEA
              </text>
              <text x={LIVE.cx} y={LIVE.cy + LIVE.r + 74} textAnchor="middle">
                LIVE
              </text>
            </g>
          </svg>
        </div>

        {/* Current leg. */}
        {reduced ? (
          <ol className="grid gap-6 border-t border-line pt-6 md:grid-cols-4">
            {process.legs.map((l, i) => (
              <li key={l.title}>
                <p className="font-mono text-label text-bronze uppercase">
                  {l.when} · Leg {i + 1}
                </p>
                <h3 className="mt-2 font-display text-[1.125rem] tracking-[0.08em] text-white uppercase">{l.title}</h3>
                <p className="mt-1.5 text-body text-muted">{l.body}</p>
              </li>
            ))}
          </ol>
        ) : (
          <div className="grid gap-4 border-t border-line pt-5 md:grid-cols-[auto_1fr_auto] md:items-end md:gap-10">
            <p className="font-mono text-label text-bronze uppercase">
              {current.when} · Leg {leg + 1}/{process.legs.length}
            </p>
            <div key={leg} className="animate-[leg-in_0.6s_cubic-bezier(0.2,0.7,0.1,1)]" aria-live="polite">
              <h3 className="font-display text-[1.125rem] tracking-[0.08em] text-white uppercase md:text-[1.375rem]">{current.title}</h3>
              <p className="mt-1.5 max-w-[40rem] text-body text-muted">{current.body}</p>
            </div>
            <div className="flex gap-1.5" aria-hidden="true">
              {process.legs.map((_, i) => (
                <span key={i} className={`h-1 w-8 rounded-full transition-colors duration-500 ${i <= leg ? (i === 3 ? 'bg-live' : 'bg-bronze') : 'bg-line'}`} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
