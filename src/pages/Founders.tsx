import {useEffect, useRef} from 'react';
import {Footer, Header} from '../components/Chrome';
import {founders, type Founder} from '../content';
import {useReducedMotion} from '../hooks/useReducedMotion';
import {useReveals} from '../hooks/useReveals';
import {stars} from '../lib/terrain';
import {clamp} from '../lib/math';
import {onFrame, startScroll} from '../lib/scroll';

/**
 * Meet the founders. The hero is the same night sky as the home page with
 * three bodies sharing one orbit — three people, one promise. Each founder
 * then gets a portrait ringed by orbits that turn as you scroll past.
 *
 * Reduce Motion: the rings hold still; everything else is identical.
 */

const SKY = stars(41, 160, 1000);

function Hero({reduced}: {reduced: boolean}) {
  const ringRef = useRef<SVGGElement>(null);
  useEffect(() => {
    if (reduced) return;
    return onFrame((t) => {
      const g = ringRef.current;
      if (!g) return;
      // A slow drift with time, nudged further by scroll.
      g.setAttribute('transform', `rotate(${(t / 400 + window.scrollY / 6) % 360} 800 500)`);
    });
  }, [reduced]);

  return (
    <section aria-labelledby="founders-title" className="relative flex min-h-svh flex-col justify-end overflow-hidden bg-void px-4 pt-32 pb-16 sm:px-6 md:px-[6vw] md:pb-24">
      <svg aria-hidden="true" viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 size-full">
        <defs>
          <radialGradient id="f-dawn" cx="50%" cy="100%" r="70%">
            <stop offset="0" stopColor="#e0b98c" stopOpacity="0.22" />
            <stop offset="0.55" stopColor="#6fb6ff" stopOpacity="0.05" />
            <stop offset="1" stopColor="#05080d" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="1600" height="1000" fill="url(#f-dawn)" />
        <g fill="#fff">
          {SKY.map((s, i) => (
            <circle key={i} cx={s.x} cy={s.y} r={s.r} opacity={s.o} />
          ))}
        </g>
        <g fill="none" stroke="#fff" strokeOpacity="0.09">
          <ellipse cx="800" cy="500" rx="560" ry="210" />
          <ellipse cx="800" cy="500" rx="380" ry="140" strokeDasharray="2 8" />
        </g>
        <g ref={ringRef}>
          {[0, 120, 240].map((a, i) => {
            const r = (a * Math.PI) / 180;
            return (
              <g key={a} transform={`translate(${800 + Math.cos(r) * 380} ${500 + Math.sin(r) * 380})`}>
                <circle r="26" fill={['#e0b98c', '#6fb6ff', '#58c9a0'][i]} opacity="0.16" />
                <circle r="7" fill={['#e0b98c', '#6fb6ff', '#58c9a0'][i]} />
              </g>
            );
          })}
        </g>
        <circle cx="800" cy="500" r="5" fill="#fff" />
      </svg>
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-b from-transparent to-void" />

      <div className="relative">
        <p className="font-mono text-label text-bronze uppercase">{founders.eyebrow}</p>
        <h1 id="founders-title" className="mt-4 max-w-[14ch] font-display text-hero leading-[0.95] text-white">
          {founders.title}
        </h1>
        <p className="mt-6 max-w-[34rem] text-lead text-regolith">{founders.lead}</p>
        <ul className="mt-10 flex flex-wrap gap-x-8 gap-y-3 font-mono text-label text-muted uppercase">
          {founders.people.map((p, i) => (
            <li key={p.name}>
              <a href={`#${slug(p.name)}`} className="inline-flex min-h-11 items-center gap-3 hover:text-white">
                <span className="text-bronze">0{i + 1}</span>
                {p.name}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

const slug = (name: string) => name.toLowerCase().replace(/[^a-z]+/g, '-');

function Portrait({p, i, reduced}: {p: Founder; i: number; reduced: boolean}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const ringsRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (reduced) return;
    const dir = i % 2 ? -1 : 1;
    return onFrame(() => {
      const wrap = wrapRef.current;
      const rings = ringsRef.current;
      if (!wrap || !rings) return;
      const r = wrap.getBoundingClientRect();
      const vh = window.innerHeight;
      if (r.bottom < 0 || r.top > vh) return;
      // -1 when entering from below, +1 when leaving at the top.
      const k = clamp((vh - r.top) / (vh + r.height)) * 2 - 1;
      rings.style.transform = `rotate(${dir * k * 50}deg)`;
    });
  }, [reduced, i]);

  const colour = ['#e0b98c', '#6fb6ff', '#58c9a0'][i % 3];

  return (
    <div ref={wrapRef} className="relative mx-auto aspect-square w-full max-w-[26rem]">
      <svg ref={ringsRef} aria-hidden="true" viewBox="0 0 400 400" className="absolute inset-0 size-full will-change-transform">
        <circle cx="200" cy="200" r="196" fill="none" stroke="#fff" strokeOpacity="0.08" />
        <ellipse cx="200" cy="200" rx="196" ry="74" fill="none" stroke="#fff" strokeOpacity="0.12" transform="rotate(-24 200 200)" />
        <circle cx="200" cy="200" r="176" fill="none" stroke={colour} strokeOpacity="0.5" strokeDasharray="1 9" strokeLinecap="round" />
        <circle cx={200 + 196 * Math.cos(-0.42)} cy={200 + 74 * Math.sin(-0.42)} r="5" fill={colour} transform="rotate(-24 200 200)" />
        <circle cx="4" cy="200" r="3" fill="#fff" opacity="0.6" />
      </svg>
      <div className="absolute inset-[14%] overflow-hidden rounded-full bg-void-2 ring-1 ring-line">
        {p.photo ? (
          <img
            src={p.photo.src}
            srcSet={p.photo.srcSet}
            sizes="(min-width: 768px) 20rem, 72vw"
            width={1024}
            height={1024}
            alt={`Portrait of ${p.name}`}
            loading={i === 0 ? 'eager' : 'lazy'}
            decoding="async"
            className="size-full object-cover brightness-[0.94] contrast-[1.03]"
          />
        ) : (
          <div className="flex size-full flex-col items-center justify-center bg-[radial-gradient(circle_at_35%_30%,#131c29,#05080d_75%)]">
            <span className="font-display text-[clamp(2.5rem,8vw,4rem)] tracking-[0.12em] text-white/80">{p.initials}</span>
            <span className="mt-3 font-mono text-label text-subtle uppercase">Photo coming soon</span>
          </div>
        )}
      </div>
    </div>
  );
}

function Person({p, i, reduced}: {p: Founder; i: number; reduced: boolean}) {
  const flip = i % 2 === 1;
  return (
    <article id={slug(p.name)} aria-labelledby={`${slug(p.name)}-name`} className="grid scroll-mt-24 items-center gap-10 border-t border-line py-20 md:grid-cols-2 md:gap-16 md:py-28">
      <div data-reveal className={flip ? 'md:order-2' : ''}>
        <Portrait p={p} i={i} reduced={reduced} />
      </div>
      <div data-reveal style={{transitionDelay: '120ms'}} className={flip ? 'md:order-1' : ''}>
        <p className="font-mono text-label text-bronze uppercase">
          0{i + 1} · {p.role}
        </p>
        <h2 id={`${slug(p.name)}-name`} className="mt-4 font-display text-display text-white">
          {p.name}
        </h2>
        <p className="mt-5 max-w-[32rem] text-lead text-regolith">{p.bio}</p>
        {p.linkedin && (
          <a href={p.linkedin} target="_blank" rel="noopener" className="mt-6 inline-flex min-h-11 items-center gap-2 font-mono text-label text-bronze uppercase hover:text-white">
            LinkedIn <span aria-hidden="true">↗</span>
          </a>
        )}
      </div>
    </article>
  );
}

export default function Founders() {
  const reduced = useReducedMotion();
  useEffect(() => startScroll(reduced), [reduced]);
  const ref = useReveals<HTMLElement>();

  return (
    <>
      <a href="#main" className="sr-only z-[60] rounded bg-white px-4 py-3 text-void focus:not-sr-only focus:fixed focus:top-3 focus:left-3">
        Skip to content
      </a>
      <Header page="founders" />
      <main id="main" ref={ref}>
        <Hero reduced={reduced} />
        <section aria-label="Founders" className="bg-void px-4 sm:px-6 md:px-[6vw]">
          {founders.people.map((p, i) => (
            <Person key={p.name} p={p} i={i} reduced={reduced} />
          ))}
        </section>
        <section aria-labelledby="founders-cta" className="relative overflow-hidden bg-void px-4 pt-20 pb-32 text-center sm:px-6 md:px-[6vw] md:pb-44">
          <div aria-hidden="true" className="pointer-events-none absolute -bottom-[62vw] left-1/2 size-[90vw] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_50%_30%,rgba(224,185,140,0.3),rgba(224,185,140,0.05)_55%,transparent_70%)]" />
          <div className="relative border-t border-line pt-20" data-reveal>
            <h2 id="founders-cta" className="mx-auto max-w-[18ch] font-display text-display text-white">
              {founders.cta.heading}
            </h2>
            <a href="/#contact" className="mt-10 inline-flex min-h-13 items-center gap-2 rounded-full bg-white px-8 font-mono text-label text-void uppercase transition-colors hover:bg-bronze">
              {founders.cta.button} <span aria-hidden="true">→</span>
            </a>
          </div>
        </section>
      </main>
      <Footer page="founders" />
    </>
  );
}
