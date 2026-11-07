/**
 * Site paths are written absolute ("/founders/", "/team/…"). The live site
 * serves them as-is. A preview build (VITE_PREVIEW=1, relative base) can be
 * hosted under any folder, so there they become relative file links.
 */
const preview = import.meta.env.VITE_PREVIEW === '1';

export function url(path: string): string {
  if (!preview || !path.startsWith('/')) return path;
  const up = window.location.pathname.includes('/founders/') ? '../' : './';
  let rest = path.slice(1);
  if (rest === '' || rest.startsWith('#')) rest = `index.html${rest}`;
  else if (rest.endsWith('/')) rest += 'index.html';
  return up + rest;
}

/** Same, for every candidate in a srcset. */
export const srcSet = (set: string) =>
  set
    .split(',')
    .map((c) => {
      const [p, w] = c.trim().split(/\s+/);
      return `${url(p)} ${w}`;
    })
    .join(', ');
