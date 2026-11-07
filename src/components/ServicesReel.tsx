import {useEffect, useRef, type MouseEvent} from 'react';
import {services} from '../content';
import {useReducedMotion} from '../hooks/useReducedMotion';
import {useReveals} from '../hooks/useReveals';
import {clamp, pinProgress, range} from '../lib/math';
import {onFrame, scrollToHash} from '../lib/scroll';
import {Vignette} from './Vignettes';

/**
 * The six services, as a reel of stills. The section pins and the reel slides
 * sideways with the scroll; the frame nearest the focus line is in focus, the
 * rest dim back, and each drawing drifts against its frame.
 *
 * Reduce Motion: no pin and no sideways travel — the same cards as a grid.
 */

const SECTION_VH = 420;

/** Pre-select a service in the enquiry form, then take the visitor there. */
export function enquireAbout(e: MouseEvent<HTMLAnchorElement>, value: string) {
  e.preventDefault();
  const select = document.querySelector<HTMLSelectElement>('#contact select[name="service"]');
  if (select) {
    select.value = value;
    select.dispatchEvent(new Event('change', {bubbles: true}));
  }
  scrollToHash('#contact');
}

function Card({i, s, featured}: {i: number; s: (typeof services.items)[number]; featured?: boolean}) {
  return (
    <figure>
      <div className="relative aspect-[3/4] overflow-hidden rounded-[10px] bg-void-2 ring-1 ring-line">
        <div data-drift className="absolute -inset-[7%] will-change-transform">
          <Vignette slug={s.slug} />
        </div>
        <span className="absolute top-3 left-3 rounded-[4px] bg-void/80 px-2 py-1 font-mono text-[0.6875rem] tracking-[0.14em] text-white uppercase">{s.tag}</span>
      </div>
      <figcaption className="mt-5 flex gap-4">
        <span className="font-mono text-label text-bronze">0{i + 1}</span>
        <span className="min-w-0">
          <span className={`block font-display tracking-[0.06em] text-white uppercase ${featured ? 'text-[1rem]' : 'text-[0.9375rem]'}`}>{s.title}</span>
          <span className="mt-2 block text-[0.9375rem] leading-relaxed text-muted">{s.body}</span>
          <a
            href="#contact"
            onClick={(e) => enquireAbout(e, s.value)}
            className="mt-3 -ml-1 inline-flex min-h-11 items-center gap-2 px-1 font-mono text-label text-bronze uppercase hover:text-white"
          >
            Enquire <span aria-hidden="true">→</span>
            <span className="sr-only">about {s.title}</span>
          </a>
        </span>
      </figcaption>
    </figure>
  );
}

export function ServicesReel() {
  const reduced = useReducedMotion();
  return reduced ? <ServicesGrid /> : <Reel />;
}

function Heading({compact = false}: {compact?: boolean}) {
  return (
    <>
      <p className="font-mono text-label text-bronze uppercase">{services.eyebrow}</p>
      <h2 id="services-title" className={`mt-4 font-display text-white ${compact ? 'text-[clamp(1.75rem,3.2vw,3rem)] leading-[1.08]' : 'text-display'}`}>
        {services.heading}
      </h2>
      <p className={`mt-5 max-w-[26rem] text-body text-muted ${compact ? 'max-md:hidden' : ''}`}>{services.body}</p>
    </>
  );
}

function ServicesGrid() {
  const ref = useReveals<HTMLElement>();
  return (
    <section ref={ref} id="services" aria-labelledby="services-title" className="bg-void px-4 py-24 sm:px-6 md:px-[6vw]">
      <div className="max-w-[40rem]" data-reveal>
        <Heading />
      </div>
      <ol className="mt-14 grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
        {services.items.map((s, i) => (
          <li key={s.slug} data-reveal>
            <Card i={i} s={s} />
          </li>
        ))}
      </ol>
    </section>
  );
}

function Reel() {
  const rootRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLOListElement>(null);
  const cardRefs = useRef<HTMLLIElement[]>([]);
  const barRef = useRef<HTMLSpanElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let lastP = -1;
    let lastW = 0;
    return onFrame(() => {
      const root = rootRef.current;
      const track = trackRef.current;
      if (!root || !track) return;
      const {p, rect, vh} = pinProgress(root);
      if (rect.bottom < 0 || rect.top > vh) return;
      const vw = window.innerWidth;
      if (Math.abs(p - lastP) < 0.00005 && vw === lastW) return;
      lastP = p;
      lastW = vw;

      const k = range(p, 0.04, 0.96);
      // offsetLeft is the untransformed layout position, so this is stable
      // while the track itself is being translated.
      // The focus line sits right of centre on wide screens (the copy column
      // takes the left third) and at the centre on narrow ones. The reel
      // travels until the last frame's centre reaches it.
      const focus = vw >= 768 ? 0.66 : 0.5;
      const last = track.lastElementChild as HTMLElement | null;
      const end = last ? track.offsetLeft + last.offsetLeft + last.offsetWidth / 2 : 0;
      const travel = Math.max(0, end - vw * focus);
      track.style.transform = `translate3d(${-k * travel}px, 0, 0)`;
      let nearest = 0;
      let best = Infinity;
      cardRefs.current.forEach((card, i) => {
        const r = card.getBoundingClientRect();
        const off = (r.left + r.width / 2 - vw * focus) / vw;
        const a = clamp(Math.abs(off) * 1.6);
        card.style.opacity = String(1 - a * 0.55);
        card.style.transform = `scale(${1 - a * 0.07})`;
        const drift = card.querySelector<HTMLElement>('[data-drift]');
        if (drift) drift.style.transform = `translate3d(${off * -40}px, 0, 0)`;
        if (Math.abs(off) < best) {
          best = Math.abs(off);
          nearest = i;
        }
      });
      cardRefs.current.forEach((card, i) => card.toggleAttribute('data-focus', i === nearest));
      barRef.current!.style.transform = `scaleX(${k})`;
      countRef.current!.textContent = `0${nearest + 1}`;
    });
  }, []);

  return (
    <section ref={rootRef} id="services" aria-labelledby="services-title" className="relative bg-void" style={{height: `${SECTION_VH}svh`}}>
      <div className="sticky top-0 flex h-screen-s flex-col justify-center overflow-hidden pt-16 md:flex-row md:items-center md:justify-start md:pt-0">
        <div className="relative z-10 shrink-0 px-4 sm:px-6 md:flex md:w-[38vw] md:flex-col md:justify-center md:self-stretch md:bg-[linear-gradient(90deg,var(--color-void)_78%,transparent)] md:pr-[4vw] md:pl-[6vw]">
          <Heading compact />
          <div className="mt-8 flex items-center gap-4 font-mono text-label text-muted uppercase max-md:hidden" aria-hidden="true">
            <span>
              <span ref={countRef} className="text-white">
                01
              </span>{' '}
              / 0{services.items.length}
            </span>
            <span className="relative h-px w-32 bg-line">
              <span ref={barRef} className="absolute inset-0 origin-left bg-bronze" style={{transform: 'scaleX(0)'}} />
            </span>
          </div>
        </div>

        <ol ref={trackRef} className="mt-6 flex gap-5 pl-4 will-change-transform sm:pl-6 md:mt-0 md:gap-7 md:pl-0">
          {services.items.map((s, i) => (
            <li
              key={s.slug}
              ref={(el) => {
                if (el) cardRefs.current[i] = el;
              }}
              className="w-[min(68vw,22rem)] shrink-0 origin-bottom sm:w-[42vw] md:w-[clamp(16rem,23vw,22rem)] max-md:[@media(max-height:760px)]:w-[min(56vw,17rem)]"
            >
              <Card i={i} s={s} />
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
