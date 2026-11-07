import {useEffect, useRef, useState, type MouseEvent} from 'react';
import {brand, nav} from '../content';
import {onFrame, scrollToHash} from '../lib/scroll';

/** On the home page "#services" scrolls in place; elsewhere it becomes "/#services". */
const resolve = (href: string, onHome: boolean) => (href.startsWith('#') && !onHome ? `/${href}` : href);

function go(e: MouseEvent<HTMLAnchorElement>, then?: () => void) {
  const hash = e.currentTarget.getAttribute('href');
  then?.();
  if (!hash?.startsWith('#')) return;
  e.preventDefault();
  scrollToHash(hash);
}

/** The K mark from the brand favicon, drawn so it stays sharp at any size. */
export function Mark({className = ''}: {className?: string}) {
  return (
    <svg viewBox="0 0 100 100" aria-hidden="true" className={className}>
      <path d="M23 18h16v26l27-26h22L56 49l34 33H68L39 54v28H23z" fill="currentColor" />
      <path d="M62 18h22L49 53 39 44z" fill="#e0b98c" />
    </svg>
  );
}

export function Header({page}: {page: 'home' | 'founders'}) {
  const onHome = page === 'home';
  const [open, setOpen] = useState(false);
  const barRef = useRef<HTMLDivElement>(null);

  // Glass only once content is underneath it.
  useEffect(() => {
    let last = false;
    return onFrame(() => {
      const on = window.scrollY > 24;
      if (on === last) return;
      last = on;
      barRef.current?.classList.toggle('glass', on);
      barRef.current?.classList.toggle('border-line', on);
    });
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 text-white">
      <div ref={barRef} className="border-b border-transparent transition-[background-color,border-color] duration-300">
        <div className="flex h-16 items-center justify-between px-4 sm:px-6 md:h-[4.5rem] md:px-[3vw]">
          <a
            href={onHome ? '#top' : '/'}
            onClick={(e) => onHome && go(e)}
            className="flex min-h-11 items-center gap-3"
            aria-label={`${brand.name} — home`}
          >
            <Mark className="size-7 text-white" />
            <span className="leading-none">
              <span className="block font-display text-[0.9375rem] tracking-[0.3em]">{brand.wordmark}</span>
              <span className="mt-1 block font-mono text-[0.625rem] tracking-[0.42em] text-muted">{brand.sub}</span>
            </span>
          </a>
          <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
            {nav.map((item) => {
              const current = item.href === '/founders/' && page === 'founders';
              return (
                <a
                  key={item.href}
                  href={resolve(item.href, onHome)}
                  onClick={(e) => onHome && go(e)}
                  aria-current={current ? 'page' : undefined}
                  className={`inline-flex min-h-11 items-center px-3 font-mono text-label uppercase transition-colors hover:text-white ${current ? 'text-bronze' : 'text-muted'}`}
                >
                  {item.label}
                </a>
              );
            })}
            <a
              href={resolve('#contact', onHome)}
              onClick={(e) => onHome && go(e)}
              className="ml-3 inline-flex min-h-11 items-center rounded-full bg-white px-5 font-mono text-label text-void uppercase transition-colors hover:bg-bronze"
            >
              Start a project
            </a>
          </nav>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="menu"
            className="-mr-2 inline-flex min-h-11 min-w-11 items-center justify-center px-2 font-mono text-label uppercase lg:hidden"
          >
            {open ? 'Close' : 'Menu'}
          </button>
        </div>
      </div>
      <div
        id="menu"
        inert={!open}
        className={`glass fixed inset-0 -z-10 flex flex-col justify-center gap-2 px-6 transition-opacity lg:hidden ${open ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
      >
        {[...nav, {label: 'Start a project', href: '#contact'}].map((item, i) => (
          <a
            key={item.href}
            href={resolve(item.href, onHome)}
            onClick={(e) => (onHome ? go(e, () => setOpen(false)) : setOpen(false))}
            className="flex min-h-14 items-baseline gap-4 py-2 font-display text-[1.5rem] tracking-[0.12em] uppercase sm:text-[1.75rem]"
          >
            <span className="font-mono text-label text-bronze">0{i + 1}</span>
            {item.label}
          </a>
        ))}
      </div>
    </header>
  );
}

export function Footer({page}: {page: 'home' | 'founders'}) {
  const onHome = page === 'home';
  return (
    <footer className="border-t border-line bg-void px-4 py-10 sm:px-6 md:px-[6vw]">
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <span className="flex items-center gap-3 text-white">
          <Mark className="size-6" />
          <span className="font-display text-[0.875rem] tracking-[0.3em]">{brand.wordmark}</span>
        </span>
        <p className="font-display text-[0.8125rem] tracking-[0.08em] text-muted">{brand.tagline}</p>
        <nav aria-label="Footer" className="-mx-3 flex flex-wrap font-mono text-label uppercase">
          <a href="/founders/" className="inline-flex min-h-11 items-center px-3 text-muted hover:text-white">
            Founders
          </a>
          <a href={brand.linkedin} target="_blank" rel="noopener" className="inline-flex min-h-11 items-center px-3 text-muted hover:text-white">
            LinkedIn ↗
          </a>
          <a href={onHome ? '#top' : '/'} onClick={(e) => onHome && go(e)} className="inline-flex min-h-11 items-center px-3 text-muted hover:text-white">
            {onHome ? 'Back to top ↑' : 'Home'}
          </a>
        </nav>
      </div>
      <div className="mt-8 flex flex-col gap-2 border-t border-line pt-6 font-mono text-label text-subtle uppercase md:flex-row md:justify-between">
        <span>
          © {new Date().getFullYear()} {brand.name}
        </span>
        <span>Kashmir, India · Working worldwide</span>
      </div>
    </footer>
  );
}
