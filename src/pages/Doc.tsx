import {useEffect, useRef, type ReactNode} from 'react';
import {Footer, Header} from '../components/Chrome';
import {useReducedMotion} from '../hooks/useReducedMotion';
import {cookies, faq, legalNav, privacy, terms, UPDATED, type Block, type DocPage, type FaqPage} from '../legal';
import {url} from '../lib/paths';
import {onFrame, scrollToHash, startScroll} from '../lib/scroll';

/**
 * One layout for Terms, Privacy, Cookies and FAQ: a quiet hero, a contents
 * rail that follows you down the page on wide screens, and readable prose
 * at ~68 characters a line. FAQ answers use native <details>, so they open
 * with the keyboard and work without JavaScript styling tricks.
 */

const PAGES = {terms, privacy, cookies, faq} as const;
export type DocSlug = keyof typeof PAGES;

/** [text](href) and **bold** inside a string. */
function Rich({text}: {text: string}) {
  const parts: ReactNode[] = [];
  const re = /\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*|`([^`]+)`/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    if (m[1]) {
      const external = /^https?:/.test(m[2]);
      parts.push(
        <a
          key={m.index}
          href={external ? m[2] : url(m[2])}
          {...(external ? {target: '_blank', rel: 'noopener'} : {})}
          className="text-white underline decoration-bronze/70 underline-offset-4 transition-colors hover:text-bronze"
        >
          {m[1]}
        </a>,
      );
    } else if (m[3]) {
      parts.push(
        <strong key={m.index} className="font-semibold text-white">
          {m[3]}
        </strong>,
      );
    } else {
      parts.push(
        <code key={m.index} className="rounded bg-void-3 px-1.5 py-0.5 font-mono text-[0.875em] text-regolith">
          {m[4]}
        </code>,
      );
    }
    last = re.lastIndex;
  }
  if (last < text.length) parts.push(text.slice(last));
  return <>{parts}</>;
}

function Blocks({body}: {body: Block[]}) {
  return (
    <>
      {body.map((b, i) =>
        typeof b === 'string' ? (
          <p key={i} className="mt-4 text-body leading-[1.7] text-regolith first:mt-0">
            <Rich text={b} />
          </p>
        ) : (
          <ul key={i} className="mt-4 space-y-2.5 first:mt-0">
            {b.list.map((li) => (
              <li key={li} className="flex gap-3 text-body leading-[1.65] text-regolith">
                <span aria-hidden="true" className="mt-[0.7em] size-1.5 shrink-0 rounded-full bg-bronze" />
                <span>
                  <Rich text={li} />
                </span>
              </li>
            ))}
          </ul>
        ),
      )}
    </>
  );
}

/** Contents rail; highlights the section currently under the reading line. */
function Contents({items}: {items: {id: string; title: string}[]}) {
  const listRef = useRef<HTMLOListElement>(null);
  useEffect(() => {
    let current = '';
    return onFrame(() => {
      const line = window.innerHeight * 0.3;
      let active = items[0]?.id ?? '';
      for (const it of items) {
        const el = document.getElementById(it.id);
        if (el && el.getBoundingClientRect().top <= line) active = it.id;
      }
      if (active === current) return;
      current = active;
      listRef.current?.querySelectorAll('a').forEach((a) => {
        const on = a.getAttribute('href') === `#${active}`;
        a.toggleAttribute('aria-current', on);
      });
    });
  }, [items]);

  return (
    <nav aria-label="On this page" className="hidden lg:block">
      <div className="sticky top-28">
        <p className="font-mono text-label text-subtle uppercase">On this page</p>
        <ol ref={listRef} className="mt-4 border-l border-line">
          {items.map((it) => (
            <li key={it.id}>
              <a
                href={`#${it.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToHash(`#${it.id}`);
                  history.replaceState(null, '', `#${it.id}`);
                }}
                className="-ml-px flex min-h-11 items-center border-l border-transparent pl-4 text-[0.9375rem] text-muted transition-colors hover:text-white aria-[current]:border-bronze aria-[current]:text-white"
              >
                {it.title}
              </a>
            </li>
          ))}
        </ol>
      </div>
    </nav>
  );
}

function Hero({page}: {page: DocPage | FaqPage}) {
  return (
    <section aria-labelledby="doc-title" className="relative overflow-hidden px-4 pt-32 pb-14 sm:px-6 md:px-[6vw] md:pt-44 md:pb-20">
      <div aria-hidden="true" className="pointer-events-none absolute -top-[40vw] left-1/2 size-[80vw] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(224,185,140,0.14),rgba(111,182,255,0.04)_45%,transparent_70%)]" />
      <div className="relative max-w-[52rem]">
        <p className="font-mono text-label text-bronze uppercase">{page.eyebrow}</p>
        <h1 id="doc-title" className="mt-4 font-display text-display text-white">
          {page.title}
        </h1>
        <p className="mt-6 max-w-[40rem] text-lead text-regolith">{page.lead}</p>
        <p className="mt-8 font-mono text-label text-subtle uppercase">Last updated · {UPDATED}</p>
      </div>
    </section>
  );
}

function DocBody({page}: {page: DocPage}) {
  return (
    <div className="grid gap-12 lg:grid-cols-[15rem_minmax(0,44rem)] lg:gap-20">
      <Contents items={page.sections} />
      <div>
        {page.sections.map((s, i) => (
          <section key={s.id} id={s.id} aria-labelledby={`${s.id}-h`} className="scroll-mt-28 border-t border-line py-10 first:border-t-0 first:pt-0">
            <h2 id={`${s.id}-h`} className="flex gap-4 font-display text-[1.125rem] tracking-[0.04em] text-white md:text-[1.25rem]">
              <span className="font-mono text-label leading-[2] text-bronze">{String(i + 1).padStart(2, '0')}</span>
              {s.title}
            </h2>
            <div className="mt-5">
              <Blocks body={s.body} />
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

function FaqBody({page}: {page: FaqPage}) {
  return (
    <div className="grid gap-12 lg:grid-cols-[15rem_minmax(0,44rem)] lg:gap-20">
      <Contents items={page.groups} />
      <div className="space-y-14">
        {page.groups.map((g) => (
          <section key={g.id} id={g.id} aria-labelledby={`${g.id}-h`} className="scroll-mt-28">
            <h2 id={`${g.id}-h`} className="font-mono text-label text-bronze uppercase">
              {g.title}
            </h2>
            <div className="mt-4 border-t border-line">
              {g.items.map((it) => (
                <details key={it.q} className="group border-b border-line">
                  <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-6 py-4 text-lead text-white transition-colors hover:text-bronze [&::-webkit-details-marker]:hidden">
                    {it.q}
                    <span aria-hidden="true" className="relative size-4 shrink-0">
                      <span className="absolute top-1/2 left-0 h-px w-4 bg-current" />
                      <span className="absolute top-0 left-1/2 h-4 w-px bg-current transition-transform duration-300 group-open:scale-y-0 motion-reduce:transition-none" />
                    </span>
                  </summary>
                  <div className="pb-6 pr-10">
                    <Blocks body={it.a} />
                  </div>
                </details>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

function MoreLinks({slug}: {slug: DocSlug}) {
  return (
    <section aria-labelledby="more-h" className="mt-24 border-t border-line pt-14 md:mt-32">
      <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 id="more-h" className="font-display text-[1.5rem] tracking-[0.02em] text-white md:text-[2rem]">
            Still have a question?
          </h2>
          <p className="mt-3 max-w-[30rem] text-body text-muted">A real person on the team reads every message.</p>
          <a href={url('/#contact')} className="mt-6 inline-flex min-h-12 items-center gap-2 rounded-full bg-white px-6 font-mono text-label text-void uppercase transition-colors hover:bg-bronze">
            Ask us <span aria-hidden="true">→</span>
          </a>
        </div>
        <nav aria-label="Policies and help" className="-mx-3 flex flex-wrap font-mono text-label uppercase">
          {legalNav.map((l) => {
            const here = l.href === `/${slug}/`;
            return (
              <a
                key={l.href}
                href={url(l.href)}
                aria-current={here ? 'page' : undefined}
                className={`inline-flex min-h-11 items-center px-3 transition-colors hover:text-white ${here ? 'text-bronze' : 'text-muted'}`}
              >
                {l.label}
              </a>
            );
          })}
        </nav>
      </div>
    </section>
  );
}

export default function Doc({slug}: {slug: DocSlug}) {
  const reduced = useReducedMotion();
  useEffect(() => startScroll(reduced), [reduced]);
  const page = PAGES[slug];

  // Arriving with a hash (e.g. /privacy/#your-rights).
  useEffect(() => {
    const hash = window.location.hash;
    if (!hash) return;
    const id = window.setTimeout(() => scrollToHash(hash), 120);
    return () => window.clearTimeout(id);
  }, []);

  return (
    <>
      <a href="#main" className="sr-only z-[60] rounded bg-white px-4 py-3 text-void focus:not-sr-only focus:fixed focus:top-3 focus:left-3">
        Skip to content
      </a>
      <Header page="doc" />
      <main id="main" className="bg-void">
        <Hero page={page} />
        <div className="px-4 pb-28 sm:px-6 md:px-[6vw] md:pb-36">
          {page.slug === 'faq' ? <FaqBody page={page} /> : <DocBody page={page} />}
          <MoreLinks slug={slug} />
        </div>
      </main>
      <Footer page="doc" />
    </>
  );
}

