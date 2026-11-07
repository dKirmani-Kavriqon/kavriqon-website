/**
 * Every word on the site. Edit copy here, not in the components.
 *
 * Anything marked TODO is a placeholder waiting on the team: confirm it
 * or change it before this goes live.
 */

export const brand = {
  name: 'Kavriqon Technologies',
  wordmark: 'KAVRIQON',
  sub: 'TECHNOLOGIES',
  tagline: 'We build it. Then we stay.',
  linkedin: 'https://linkedin.com/company/kavriqon-technologies',
};

export type NavItem = {label: string; href: string};

/** Hash links are written for the home page; other pages prefix them with "/". */
export const nav: NavItem[] = [
  {label: 'Services', href: '#services'},
  {label: 'Process', href: '#process'},
  {label: 'Work with us', href: '#engage'},
  {label: 'Founders', href: '/founders/'},
];

export const hero = {
  title: 'KAVRIQON',
  kicker: 'We build it. Then we stay.',
  veil: 'Scroll to clear the mist',
  /** Srinagar — the same coordinates the original site carried. */
  site: 'Srinagar, Kashmir · 34°05′N 74°50′E',
};

export const intro = {
  eyebrow: 'Kavriqon Technologies',
  heading: 'Software that ships. People who stay.',
  body: 'We design and build websites, apps, automations and AI for growing businesses — and we stay after launch to keep them running, improving and earning their keep.',
};

export type Service = {
  slug: 'web' | 'app' | 'automation' | 'ai' | 'data' | 'seo';
  tag: string;
  title: string;
  /** The value sent to the enquiry Worker as `service`. */
  value: string;
  body: string;
  points: string[];
};

export const services = {
  eyebrow: 'Services',
  heading: 'Six ways we move your business forward.',
  body: 'Start with one. Most clients add more, because the pieces work best together.',
  items: [
    {
      slug: 'web',
      tag: 'Build',
      title: 'Web development',
      value: 'Web development',
      body: 'Fast, accessible websites and web apps that earn trust and turn visitors into enquiries.',
      points: ['Marketing sites', 'Web apps & portals', 'Performance & accessibility'],
    },
    {
      slug: 'app',
      tag: 'Build',
      title: 'App development',
      value: 'App development',
      body: 'iOS, Android and cross-platform apps that people keep on their home screen.',
      points: ['iOS & Android', 'Cross-platform', 'App Store launch'],
    },
    {
      slug: 'automation',
      tag: 'Automate',
      title: 'Automation & integration',
      value: 'Automation integration',
      body: 'Connect the tools you already use and remove the copy-paste work between them.',
      points: ['Workflow automation', 'API integrations', 'CRM & ERP sync'],
    },
    {
      slug: 'ai',
      tag: 'AI',
      title: 'Business solutions with AI',
      value: 'Business solutions with AI',
      body: 'Assistants, document processing and decision support that fit how your team already works.',
      points: ['AI assistants', 'Document AI', 'Decision support'],
    },
    {
      slug: 'data',
      tag: 'Data',
      title: 'Customer segmentation',
      value: 'Data analysis for customer segmentation',
      body: 'Data analysis that shows who your customers really are, so each group gets the right offer.',
      points: ['Data clean-up', 'Segmentation models', 'Dashboards'],
    },
    {
      slug: 'seo',
      tag: 'Growth',
      title: 'AI with SEO',
      value: 'AI with SEO',
      body: 'AI-assisted content and technical SEO that helps the right people find you — and stay.',
      points: ['Technical SEO', 'AI-assisted content', 'Search analytics'],
    },
  ] satisfies Service[],
};

/** The project path, drawn as you scroll. Timeline is a typical project, not a quote. */
export const process = {
  eyebrow: 'Process',
  heading: 'From idea to live, drawn as you scroll.',
  note: 'Typical project timeline',
  legs: [
    {when: 'Week 1–2', title: 'Discover', body: 'We learn how your business actually works and agree, in writing, what “done” looks like.'},
    {when: 'Week 2–10', title: 'Design & build', body: 'Clickable designs first, then short build cycles you can see and test every single week.'},
    {when: 'Week 10–12', title: 'Launch', body: 'Tested, documented and live — with your team trained to run it from day one.'},
    {when: 'Always', title: 'Stay', body: 'Monitoring, fixes and improvements from the same people who built it. This leg never ends.'},
  ],
};

export const engage = {
  eyebrow: 'Work with us',
  heading: 'Three ways to start.',
  note: 'Every engagement starts with a free conversation.',
  items: [
    {name: 'Project', line: 'One build, done properly.', rings: 1, points: ['Fixed scope, written estimate', 'Design → build → launch', 'Handover and training'], cta: 'Start a project'},
    {name: 'Partner', line: 'We build it. Then we stay.', rings: 3, featured: true, points: ['Everything in Project', 'Monthly improvements', 'A named lead who knows your product'], cta: 'Become a partner'},
    {name: 'Care', line: 'For software you already have.', rings: 2, points: ['Monitoring and fixes', 'Updates and testing', 'Help when you need it'], cta: 'Get support'},
  ],
};

export const enquiry = {
  eyebrow: 'Start a project',
  heading: 'Tell us what’s slowing you down.',
  body: 'A few lines is enough. A real person from the team reads every enquiry and writes back — no bots, no sales script.',
  clockLabel: 'Time in Srinagar right now',
  notSure: 'Not sure yet — let’s discuss',
};

export type Founder = {
  name: string;
  /** TODO: confirm each person's title. */
  role: string;
  /** TODO: a two-line bio for each founder. */
  bio: string;
  initials: string;
  /** Leave empty until the photo arrives; the card shows a placeholder. */
  photo?: {src: string; srcSet: string};
  linkedin?: string;
};

export const founders = {
  eyebrow: 'Founders',
  title: 'THE PEOPLE BEHIND IT',
  lead: 'Three people, one promise: the team that builds your product is the team that stays with it.',
  people: [
    {
      name: 'Dawar Kirmani',
      role: 'Co-founder',
      bio: 'Bio coming soon.',
      initials: 'DK',
      photo: {src: '/team/dawar-kirmani-1024.webp', srcSet: '/team/dawar-kirmani-512.webp 512w, /team/dawar-kirmani-1024.webp 1024w'},
    },
    {name: 'Huzaib Wadoo', role: 'Co-founder', bio: 'Bio coming soon.', initials: 'HW'},
    {name: 'Faheem Mushtaq', role: 'Co-founder', bio: 'Bio coming soon.', initials: 'FM'},
  ] satisfies Founder[],
  cta: {heading: 'Talk to the people who’ll build it.', button: 'Start a conversation'},
};
