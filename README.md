# Kavriqon Technologies website

Cinematic rebuild of kavriqontechnologies.com: Vite 6, React 19, TypeScript, Tailwind CSS v4 and Lenis smooth scroll. Two pages: the home page (`/`) and the founders page (`/founders/`).

## Develop

```bash
npm install
npm run dev      # http://localhost:3006
npm run lint     # type check
npm run build    # outputs dist/
npm run preview  # serve the built site
npm run build:preview  # dist-preview/: relative links, works from any folder (for sharing a preview)
```

## Deploy (Cloudflare)

`wrangler.jsonc` is set up for the existing Worker, `kavriqon-technologies`. Wrangler runs `npm run build` and then uploads `dist/` as static files. There is no Worker script; Cloudflare serves the files directly.

**From your computer**

```bash
npx wrangler login   # once
npm run deploy       # builds, then deploys to kavriqon-technologies
```

**From Git (Cloudflare dashboard → Workers & Pages → kavriqon-technologies → Settings → Build)**

- Build command: `npm run build` (or leave it empty: the deploy step builds anyway)
- Deploy command: `npx wrangler deploy`
- Root directory: `/`

Routing: `/founders/` serves `founders/index.html`, `/founders` redirects to `/founders/`, and unknown paths get `404.html`. `npm run cf:dev` runs the same setup locally.

## Enquiry form

The form posts exactly what the old site did: JSON `{name, email, phone, service, message, website}` to `https://kavriqon-enquiries.dawarqay.workers.dev/submit` (see `src/lib/enquiry.ts`). A reply counts as sent only when it is `2xx` with `{"success": true}`. The `service` field now carries the new service names listed in `src/content.ts`.

## Editing content

All copy lives in `src/content.ts`: services, process, ways to work, enquiry text and founders. To add a founder photo, put a square WebP at 1024px and 512px in `public/team/` and add a `photo` entry for that person, as Dawar's has.

## Where things are

- `src/components/Daybreak.tsx`: the pinned hero (a drawn Kashmir valley at sunrise)
- `src/components/ServicesReel.tsx` and `Vignettes.tsx`: the sideways services reel and its six drawings
- `src/components/Process.tsx`: the idea-to-live route drawn on scroll
- `src/components/Engage.tsx` and `Enquiry.tsx`: ways to work and the contact form
- `src/pages/Founders.tsx`: the founders page
- `src/lib/scroll.ts`: the single animation loop every scroll effect runs on

Every motion effect has a still version for visitors who turn on Reduce Motion.
