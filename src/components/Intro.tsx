import {intro, services} from '../content';
import {useReveals} from '../hooks/useReveals';

/** The handover from the hero: what Kavriqon is, in one breath. */
export function Intro() {
  const ref = useReveals<HTMLElement>();
  return (
    <section ref={ref} aria-labelledby="intro-title" className="relative bg-void px-4 pt-16 pb-16 sm:px-6 md:px-[6vw] md:pt-20 md:pb-24">
      <div className="grid gap-10 md:grid-cols-[1fr_1.15fr] md:gap-20">
        <div data-reveal>
          <p className="font-mono text-label text-bronze uppercase">{intro.eyebrow}</p>
          <h2 id="intro-title" className="mt-4 font-display text-display text-white">
            {intro.heading}
          </h2>
        </div>
        <div data-reveal style={{transitionDelay: '120ms'}} className="md:pt-10">
          <p className="text-lead text-regolith">{intro.body}</p>
          <ul className="mt-10 grid grid-cols-2 gap-x-6 gap-y-3 border-t border-line pt-6 sm:grid-cols-3" aria-label="What we do">
            {services.items.map((s, i) => (
              <li key={s.slug} className="flex items-baseline gap-3 text-[0.9375rem] text-muted">
                <span className="font-mono text-label text-bronze">0{i + 1}</span>
                {s.title}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
