import {useId, type ReactElement, type ReactNode} from 'react';
import type {Service} from '../content';

/**
 * One drawn still per service, in one visual language: line work on the
 * night panel, bronze for what we build, signal blue for data, green for
 * "live". Vector, so they stay sharp at any card size or screen density.
 * Loops only run when motion is allowed (.motion-loop).
 */

const MONO = 'IBM Plex Mono, monospace';

function Frame({children, label}: {children: ReactNode; label: string}) {
  const id = useId().replace(/[^a-zA-Z0-9_-]/g, '');
  return (
    <svg viewBox="0 0 300 400" className="size-full" role="img" aria-label={label}>
      <defs>
        <pattern id={`grid${id}`} width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M20 0H0V20" fill="none" stroke="#ffffff" strokeOpacity="0.045" />
        </pattern>
        <radialGradient id={`glow${id}`} cx="0.5" cy="0.35" r="0.7">
          <stop offset="0" stopColor="#e0b98c" stopOpacity="0.16" />
          <stop offset="1" stopColor="#e0b98c" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="300" height="400" fill="#0c131d" />
      <rect width="300" height="400" fill={`url(#grid${id})`} />
      <rect width="300" height="400" fill={`url(#glow${id})`} />
      {children}
    </svg>
  );
}

function Web() {
  return (
    <Frame label="A browser window with a fast, accessible site scoring 100">
      <g transform="translate(34 70)">
        <rect width="232" height="250" rx="10" fill="#131c29" stroke="#2a3646" />
        <circle cx="16" cy="15" r="3.5" fill="#3a4656" />
        <circle cx="28" cy="15" r="3.5" fill="#3a4656" />
        <circle cx="40" cy="15" r="3.5" fill="#3a4656" />
        <rect x="60" y="9" width="150" height="12" rx="6" fill="#0c131d" />
        <path d="M0 30H232" stroke="#2a3646" />
        <rect x="18" y="50" width="110" height="10" rx="3" fill="#d3d6dc" />
        <rect x="18" y="68" width="80" height="10" rx="3" fill="#e0b98c" />
        <rect x="18" y="92" width="120" height="5" rx="2.5" fill="#3a4656" />
        <rect x="18" y="103" width="100" height="5" rx="2.5" fill="#3a4656" />
        <rect x="18" y="122" width="58" height="18" rx="9" fill="#e0b98c" />
        <g transform="translate(176 92)">
          <circle r="30" fill="none" stroke="#1f2a38" strokeWidth="5" />
          <circle r="30" fill="none" stroke="#58c9a0" strokeWidth="5" strokeLinecap="round" strokeDasharray="188.5" strokeDashoffset="0" transform="rotate(-90)" />
          <text y="6" textAnchor="middle" fontFamily={MONO} fontSize="17" fill="#eef1f5">100</text>
        </g>
        <rect x="18" y="162" width="62" height="64" rx="6" fill="#0c131d" stroke="#2a3646" />
        <rect x="86" y="162" width="62" height="64" rx="6" fill="#0c131d" stroke="#2a3646" />
        <rect x="154" y="162" width="62" height="64" rx="6" fill="#0c131d" stroke="#2a3646" />
        <path d="M30 210l12-14 10 8 14-18" fill="none" stroke="#6fb6ff" strokeWidth="2" />
      </g>
      <text x="34" y="350" fontFamily={MONO} fontSize="11" letterSpacing="2" fill="#9ba1ab">LCP 0.9s · A11Y AA</text>
    </Frame>
  );
}

function App() {
  return (
    <Frame label="A phone running a client app with a new-order notification">
      <g transform="translate(88 44)">
        <rect width="124" height="250" rx="22" fill="#131c29" stroke="#3a4656" strokeWidth="2" />
        <rect x="46" y="8" width="32" height="8" rx="4" fill="#05080d" />
        <rect x="12" y="30" width="60" height="7" rx="3" fill="#d3d6dc" />
        <rect x="12" y="44" width="40" height="5" rx="2.5" fill="#7f8590" />
        <rect x="12" y="62" width="100" height="56" rx="10" fill="#e0b98c" fillOpacity="0.16" stroke="#e0b98c" strokeOpacity="0.5" />
        <rect x="22" y="74" width="50" height="6" rx="3" fill="#e0b98c" />
        <rect x="22" y="88" width="70" height="5" rx="2.5" fill="#9ba1ab" />
        <rect x="22" y="99" width="40" height="5" rx="2.5" fill="#9ba1ab" />
        <rect x="12" y="128" width="46" height="46" rx="10" fill="#0c131d" stroke="#2a3646" />
        <rect x="66" y="128" width="46" height="46" rx="10" fill="#0c131d" stroke="#2a3646" />
        <rect x="12" y="182" width="100" height="22" rx="8" fill="#0c131d" stroke="#2a3646" />
        <rect x="12" y="212" width="100" height="22" rx="8" fill="#0c131d" stroke="#2a3646" />
      </g>
      <g transform="translate(150 300)">
        <rect x="-110" y="0" width="220" height="44" rx="14" fill="#131c29" stroke="#58c9a0" strokeOpacity="0.6" />
        <circle cx="-88" cy="22" r="5" fill="#58c9a0" />
        <circle cx="-88" cy="22" r="5" fill="none" stroke="#58c9a0" className="motion-loop" style={{transformBox: 'fill-box', transformOrigin: 'center', animation: 'pulse-ring 2s ease-out infinite'}} />
        <text x="-72" y="19" fontFamily={MONO} fontSize="10" letterSpacing="1" fill="#9ba1ab">NEW ORDER</text>
        <text x="-72" y="33" fontFamily="Manrope, sans-serif" fontSize="12" fill="#eef1f5">#1024 · ready for pickup</text>
      </g>
    </Frame>
  );
}

function Automation() {
  const wire = {fill: 'none', stroke: '#6fb6ff', strokeWidth: 2, strokeDasharray: '6 14', className: 'motion-loop', style: {animation: 'flow 1.4s linear infinite'}};
  const node = (x: number, y: number, label: string, accent = '#2a3646') => (
    <g transform={`translate(${x} ${y})`}>
      <rect x="-46" y="-20" width="92" height="40" rx="10" fill="#131c29" stroke={accent} />
      <text y="4" textAnchor="middle" fontFamily={MONO} fontSize="10.5" letterSpacing="1.5" fill="#d3d6dc">{label}</text>
    </g>
  );
  return (
    <Frame label="Four tools connected by automated data flows">
      <path d="M96 96 C150 96 150 170 150 196" {...wire} />
      <path d="M204 96 C150 96 150 170 150 196" {...wire} />
      <path d="M150 236 C150 270 96 270 96 300" {...wire} />
      <path d="M150 236 C150 270 204 270 204 300" {...wire} />
      {node(80, 96, 'FORMS')}
      {node(220, 96, 'EMAIL')}
      <g transform="translate(150 216)">
        <circle r="30" fill="#e0b98c" fillOpacity="0.14" stroke="#e0b98c" />
        <path d="M-9 -12 L6 -2 L-4 2 L9 12" fill="none" stroke="#e0b98c" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      {node(80, 320, 'CRM', '#58c9a0')}
      {node(220, 320, 'INVOICE', '#58c9a0')}
      <text x="150" y="374" textAnchor="middle" fontFamily={MONO} fontSize="11" letterSpacing="2" fill="#9ba1ab">0 MANUAL STEPS</text>
    </Frame>
  );
}

function Ai() {
  return (
    <Frame label="An AI assistant answering a staff question from company documents">
      <g fontFamily="Manrope, sans-serif" fontSize="12.5">
        <rect x="104" y="64" width="166" height="48" rx="16" fill="#eef1f5" />
        <text x="118" y="85" fill="#05080d">Which invoices are</text>
        <text x="118" y="101" fill="#05080d">overdue this week?</text>
        <rect x="30" y="132" width="200" height="104" rx="16" fill="#131c29" stroke="#2a3646" />
        <text x="46" y="156" fill="#eef1f5">Three are overdue,</text>
        <text x="46" y="173" fill="#eef1f5">₹1,84,000 in total.</text>
        <rect x="46" y="188" width="76" height="22" rx="11" fill="#e0b98c" fillOpacity="0.16" stroke="#e0b98c" strokeOpacity="0.6" />
        <text x="58" y="203" fontFamily={MONO} fontSize="9.5" fill="#e0b98c">3 SOURCES</text>
        <rect x="128" y="188" width="84" height="22" rx="11" fill="#58c9a0" fillOpacity="0.14" stroke="#58c9a0" strokeOpacity="0.6" />
        <text x="139" y="203" fontFamily={MONO} fontSize="9.5" fill="#58c9a0">REMIND ALL</text>
      </g>
      <g transform="translate(244 268)" fill="#e0b98c">
        <path d="M0 -22 L5 -5 L22 0 L5 5 L0 22 L-5 5 L-22 0 L-5 -5 Z" />
        <path d="M-30 -30 l2 -7 2 7 7 2 -7 2 -2 7 -2 -7 -7 -2 Z" opacity="0.6" />
      </g>
      <rect x="30" y="300" width="160" height="34" rx="17" fill="#0c131d" stroke="#2a3646" />
      <text x="46" y="321" fontFamily={MONO} fontSize="10" fill="#7f8590">ASK ANYTHING…</text>
    </Frame>
  );
}

function Data() {
  const cluster = (cx: number, cy: number, n: number, spread: number, color: string, seed: number) =>
    Array.from({length: n}, (_, i) => {
      const a = (i * 2.399 + seed) % (Math.PI * 2);
      const r = spread * Math.sqrt(((i * 37 + seed * 11) % 100) / 100);
      return <circle key={i} cx={cx + Math.cos(a) * r} cy={cy + Math.sin(a) * r} r="3.2" fill={color} />;
    });
  return (
    <Frame label="Customers plotted and grouped into three labelled segments">
      <g transform="translate(36 60)">
        <path d="M0 0V230H228" fill="none" stroke="#3a4656" />
        {cluster(62, 160, 22, 34, '#e0b98c', 1)}
        {cluster(150, 70, 20, 30, '#6fb6ff', 2)}
        {cluster(176, 178, 16, 26, '#58c9a0', 3)}
        <circle cx="62" cy="160" r="44" fill="none" stroke="#e0b98c" strokeDasharray="4 5" />
        <circle cx="150" cy="70" r="40" fill="none" stroke="#6fb6ff" strokeDasharray="4 5" />
        <circle cx="176" cy="178" r="34" fill="none" stroke="#58c9a0" strokeDasharray="4 5" />
        <g fontFamily={MONO} fontSize="10" letterSpacing="1.2">
          <text x="20" y="104" fill="#e0b98c">A · LOYAL</text>
          <text x="120" y="20" fill="#6fb6ff">B · NEW</text>
          <text x="150" y="132" fill="#58c9a0">C · AT RISK</text>
        </g>
      </g>
      <text x="36" y="340" fontFamily={MONO} fontSize="11" letterSpacing="2" fill="#9ba1ab">3 SEGMENTS · 58 CUSTOMERS</text>
    </Frame>
  );
}

function Seo() {
  return (
    <Frame label="A search results page with the client's site climbing to first place">
      <g transform="translate(30 64)">
        <rect width="240" height="36" rx="18" fill="#131c29" stroke="#2a3646" />
        <circle cx="20" cy="18" r="6" fill="none" stroke="#9ba1ab" strokeWidth="1.6" />
        <path d="M24.5 22.5l4 4" stroke="#9ba1ab" strokeWidth="1.6" />
        <text x="38" y="23" fontFamily="Manrope, sans-serif" fontSize="12.5" fill="#d3d6dc">app developers near me</text>
        <g transform="translate(0 56)">
          <rect width="240" height="64" rx="12" fill="#e0b98c" fillOpacity="0.12" stroke="#e0b98c" strokeOpacity="0.7" />
          <text x="14" y="22" fontFamily={MONO} fontSize="9.5" letterSpacing="1" fill="#e0b98c">YOURSITE.COM</text>
          <rect x="14" y="31" width="150" height="7" rx="3.5" fill="#eef1f5" />
          <rect x="14" y="45" width="190" height="5" rx="2.5" fill="#7f8590" />
          <g transform="translate(214 24)">
            <circle r="13" fill="#58c9a0" />
            <text y="4" textAnchor="middle" fontFamily={MONO} fontSize="11" fill="#05080d">#1</text>
          </g>
        </g>
        {[136, 206].map((y) => (
          <g key={y} transform={`translate(0 ${y})`} opacity="0.55">
            <rect width="240" height="56" rx="12" fill="#131c29" stroke="#2a3646" />
            <rect x="14" y="16" width="70" height="5" rx="2.5" fill="#6fb6ff" />
            <rect x="14" y="28" width="140" height="6" rx="3" fill="#9ba1ab" />
            <rect x="14" y="40" width="170" height="5" rx="2.5" fill="#3a4656" />
          </g>
        ))}
      </g>
      <path d="M244 318 l0 -26 M236 300 l8 -8 8 8" fill="none" stroke="#58c9a0" strokeWidth="2" strokeLinecap="round" />
    </Frame>
  );
}

const MAP: Record<Service['slug'], () => ReactElement> = {web: Web, app: App, automation: Automation, ai: Ai, data: Data, seo: Seo};

export function Vignette({slug}: {slug: Service['slug']}) {
  const C = MAP[slug];
  return <C />;
}
