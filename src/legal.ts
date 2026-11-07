/**
 * Terms, Privacy, Cookies and FAQ. Plain data so it is easy to edit.
 *
 * Inline syntax in any string: [link text](/path) and **bold**.
 * A block is either a paragraph (string) or a bullet list ({list: [...]}).
 *
 * These are good-faith drafts written from how the site actually works
 * (no analytics, no ad cookies, one enquiry form). Have them checked by a
 * lawyer before relying on them.
 */

export type Block = string | {list: string[]};
export type Section = {id: string; title: string; body: Block[]};
export type DocPage = {
  slug: 'terms' | 'privacy' | 'cookies';
  eyebrow: string;
  title: string;
  lead: string;
  sections: Section[];
};
export type FaqPage = {
  slug: 'faq';
  eyebrow: string;
  title: string;
  lead: string;
  groups: {id: string; title: string; items: {q: string; a: Block[]}[]}[];
};

export const UPDATED = '7 November 2026';

/** How to reach us about anything on these pages. */
const CONTACT = 'the [contact form](/#contact) on our home page';

export const privacy: DocPage = {
  slug: 'privacy',
  eyebrow: 'Legal',
  title: 'Privacy Policy',
  lead: 'What we collect when you use this website, why, who else sees it, and how to have it changed or deleted. Short version: only what you type into our enquiry form, used only to reply to you.',
  sections: [
    {
      id: 'who-we-are',
      title: 'Who we are',
      body: [
        'This website, kavriqontechnologies.com, is run by Kavriqon Technologies, based in Srinagar, Kashmir, India (“Kavriqon”, “we”, “us”). We decide how the personal data described here is used, so we are responsible for it.',
        `For any privacy question or request, write to us through ${CONTACT} and mention “privacy” in your message.`,
      ],
    },
    {
      id: 'what-we-collect',
      title: 'What we collect',
      body: [
        '**When you send an enquiry**, we receive what you type into the form:',
        {list: ['Your name', 'Your email address', 'Your phone or WhatsApp number, if you choose to give it', 'The service you are interested in', 'Your message']},
        '**When you visit any page**, our hosting provider and the font service receive the technical details every browser sends with a request: your IP address, browser and device type, the page requested and the time. We do not combine this with your enquiry or use it to identify you.',
        'We do **not** use analytics, advertising or tracking tools, and we do not build profiles of visitors.',
      ],
    },
    {
      id: 'how-we-use-it',
      title: 'How we use it',
      body: [
        {
          list: [
            'To read and reply to your enquiry, and to talk with you about the work you asked about.',
            'If we go on to work together, to plan, deliver and support that work under our agreement with you.',
            'To keep the website secure and working, for example by blocking spam and abuse.',
          ],
        },
        'We use your enquiry details because you chose to send them to us and asked for a reply (your consent, and steps taken at your request before any contract). We use technical request data because we have a legitimate interest in running a safe, working website.',
        'We will not send you marketing emails unless you ask us to, and we never sell or rent your personal data.',
      ],
    },
    {
      id: 'who-else-sees-it',
      title: 'Who else sees it',
      body: [
        'We use a small number of service providers who handle data on our behalf, only to run this website and deliver your enquiry to us:',
        {
          list: [
            '**Cloudflare**: hosts the website and processes the enquiry form.',
            '**Resend**: delivers your enquiry to our inbox by email.',
            '**Google Fonts**: serves the typefaces this site uses. Your browser requests them directly from Google.',
          ],
        },
        'These providers may process data outside India, including in the United States and the European Union. Each is bound by its own security and data-protection commitments.',
        'We may also disclose information if the law requires it, or to protect our rights or the safety of others.',
      ],
    },
    {
      id: 'how-long',
      title: 'How long we keep it',
      body: [
        'We keep enquiries for as long as we need them to talk with you, and for up to 24 months after our last contact, so we have the history if you come back to us. If we become your supplier, we keep project records for as long as our agreement and Indian law require.',
        'Hosting providers keep technical request logs for short periods set by their own policies.',
      ],
    },
    {
      id: 'your-rights',
      title: 'Your rights',
      body: [
        'Under India’s Digital Personal Data Protection Act, 2023, and, where they apply to you, laws such as the EU and UK GDPR, you can ask us to:',
        {
          list: [
            'Tell you what personal data we hold about you and how we use it',
            'Correct or complete it',
            'Delete it',
            'Withdraw any consent you gave. This does not affect what we did before you withdrew it.',
            'Name someone to act for you if you are unable to',
          ],
        },
        `Send any request through ${CONTACT}. We will reply within 30 days. If you are not satisfied with our answer, you can complain to the Data Protection Board of India or, if you are in the EU or UK, to your local data-protection authority.`,
      ],
    },
    {
      id: 'security',
      title: 'Security',
      body: [
        'The whole site is served over HTTPS, the enquiry form sends your details over an encrypted connection, and access to enquiries is limited to the people on our team who need it. No system is perfectly secure. If we ever learn of a breach that affects your data, we will tell you and the authorities as the law requires.',
      ],
    },
    {
      id: 'children',
      title: 'Children',
      body: ['This website is meant for businesses. It is not directed at children, and we do not knowingly collect data from anyone under 18.'],
    },
    {
      id: 'changes',
      title: 'Changes to this policy',
      body: ['If we change how we handle personal data, we will update this page and the date at the top. For significant changes affecting people who have contacted us, we will let them know directly.'],
    },
  ],
};

export const cookies: DocPage = {
  slug: 'cookies',
  eyebrow: 'Legal',
  title: 'Cookie Policy',
  lead: 'We don’t use advertising or analytics cookies, so there is no cookie banner to click through. This page explains the little that does happen in your browser.',
  sections: [
    {
      id: 'what-cookies-are',
      title: 'What cookies are',
      body: ['Cookies are small text files a website stores in your browser. Similar technologies include local storage and the requests a page makes to other services. This policy covers all of them.'],
    },
    {
      id: 'what-we-use',
      title: 'What this website uses',
      body: [
        '**Kavriqon sets no cookies of its own.** This site does not use analytics, advertising, social-media or tracking cookies, and it does not store anything in your browser’s local storage.',
        'The only cookies you may see come from our hosting provider:',
        {
          list: [
            '**Cloudflare security cookies** (for example `__cf_bm` or `cf_clearance`). These are strictly necessary. They help tell people from bots and protect the site and the enquiry form from abuse. They hold no personal profile and usually expire within 30 minutes to a day.',
          ],
        },
        'Because these cookies are strictly necessary to deliver the site safely, the law does not require your consent for them.',
      ],
    },
    {
      id: 'third-parties',
      title: 'Requests to other services',
      body: [
        'To show our typefaces, your browser downloads them from **Google Fonts**. This sends Google your IP address and browser details, but sets no cookies. See [Google’s privacy policy](https://policies.google.com/privacy) for how Google handles this.',
        'Links to LinkedIn and other sites take you to services with their own cookie policies.',
      ],
    },
    {
      id: 'control',
      title: 'Controlling cookies',
      body: [
        'You can block or delete cookies in your browser settings. Blocking Cloudflare’s security cookies may mean you are occasionally asked to prove you are not a bot. Otherwise the site works the same.',
        'If we ever add optional cookies, such as analytics, we will ask for your consent first and update this page.',
      ],
    },
    {
      id: 'more',
      title: 'More information',
      body: [`See our [Privacy Policy](/privacy/) for how we handle personal data, or ask us anything through ${CONTACT}.`],
    },
  ],
};

export const terms: DocPage = {
  slug: 'terms',
  eyebrow: 'Legal',
  title: 'Terms of Service',
  lead: 'The terms for using this website and for how we work with clients. Any project we take on also has its own written agreement, and that agreement comes first.',
  sections: [
    {
      id: 'about',
      title: 'About these terms',
      body: [
        'These terms apply to kavriqontechnologies.com, run by Kavriqon Technologies, Srinagar, Kashmir, India (“Kavriqon”, “we”, “us”). By using the site, you agree to them. If you do not agree, please do not use the site.',
      ],
    },
    {
      id: 'using-the-site',
      title: 'Using the website',
      body: [
        'You may browse the site and contact us through it. Please don’t:',
        {
          list: [
            'Use it for anything unlawful, or send us spam or misleading enquiries',
            'Try to break, overload or gain unauthorised access to the site or the systems behind it',
            'Copy or scrape the site’s content, design or code to reuse it',
          ],
        },
      ],
    },
    {
      id: 'our-content',
      title: 'Our content',
      body: [
        'The text, illustrations, design, code and the Kavriqon name and logo on this site belong to Kavriqon or are used with permission. You may share links to our pages. Any other use needs our written permission.',
      ],
    },
    {
      id: 'enquiries-and-quotes',
      title: 'Enquiries, estimates and projects',
      body: [
        'Sending an enquiry does not create a contract. The first conversation is free and commits neither of us to anything.',
        'If we go ahead, we will agree a written estimate or agreement covering scope, timeline, price, payment terms, ownership of the work and support. That agreement governs the project. Where it conflicts with these terms, the agreement wins.',
        'Timelines on this site, such as a typical 12-week build, are examples to help you plan. They are not promises for any particular project.',
      ],
    },
    {
      id: 'no-warranty',
      title: 'Information on this site',
      body: [
        'We work to keep this site accurate and available, but it is provided “as is”. The site does not give professional, legal or financial advice. We may change or remove any part of it at any time.',
      ],
    },
    {
      id: 'liability',
      title: 'Limits of our liability',
      body: [
        'To the extent the law allows, we are not liable for any indirect or consequential loss arising from your use of this website, or for losses caused by events outside our reasonable control. Nothing in these terms limits liability that cannot be limited by law.',
      ],
    },
    {
      id: 'other-sites',
      title: 'Links to other sites',
      body: ['We link to services such as LinkedIn. We are not responsible for their content or how they handle your data.'],
    },
    {
      id: 'privacy',
      title: 'Privacy and cookies',
      body: ['Our [Privacy Policy](/privacy/) and [Cookie Policy](/cookies/) explain how we handle your data and what the site stores in your browser. They form part of these terms.'],
    },
    {
      id: 'law',
      title: 'Governing law',
      body: [
        'These terms are governed by the laws of India. Any dispute will be handled by the courts at Srinagar, Jammu and Kashmir, unless the law gives you the right to bring a claim where you live.',
      ],
    },
    {
      id: 'changes',
      title: 'Changes and contact',
      body: [`We may update these terms from time to time. The date at the top shows the latest version. Questions? Ask us through ${CONTACT}.`],
    },
  ],
};

export const faq: FaqPage = {
  slug: 'faq',
  eyebrow: 'Help',
  title: 'Questions & Answers',
  lead: 'The things people ask us most before they get in touch. If yours isn’t here, ask us directly. The first conversation is free.',
  groups: [
    {
      id: 'working-together',
      title: 'Working together',
      items: [
        {
          q: 'What does Kavriqon do?',
          a: [
            'We design, build and support software for growing businesses: websites, mobile apps, automation and integrations, AI for everyday business work, customer-segmentation analysis, and AI-assisted SEO. After launch we stay on to keep it running and improving.',
          ],
        },
        {
          q: 'Who do you work with?',
          a: ['Small and growing businesses, from first-time founders to established companies modernising how they work. We are based in Kashmir and work with clients across India and worldwide, remotely.'],
        },
        {
          q: 'How do we get started?',
          a: [
            'Send us a few lines through the [enquiry form](/#contact). A real person on the team reads it and replies to set up a free first conversation. We then agree in writing what “done” looks like before any work starts.',
          ],
        },
        {
          q: 'Which way of working is right for me?',
          a: [
            {
              list: [
                '**Project**: one build with a fixed scope and a written estimate, then handover and training.',
                '**Partner**: everything in Project, plus monthly improvements and a named lead who knows your product.',
                '**Care**: monitoring, fixes and updates for software you already have, even if someone else built it.',
              ],
            },
            'Not sure? Tell us what you are trying to achieve, and we will suggest one.',
          ],
        },
      ],
    },
    {
      id: 'timeline-and-cost',
      title: 'Timeline & cost',
      items: [
        {
          q: 'How long does a project take?',
          a: [
            'A typical build is about 12 weeks: 1 to 2 weeks of discovery, design and build in short weekly cycles, then launch around weeks 10 to 12. Smaller projects can be quicker, and larger ones are split into stages. We give you a timeline for your project before you commit.',
          ],
        },
        {
          q: 'How much will it cost?',
          a: [
            'It depends on what you need, so we don’t publish fixed prices. After the first conversation, you get a written estimate with the scope, timeline and price, and it is yours to keep whether or not you go ahead.',
          ],
        },
        {
          q: 'Will I see progress during the build?',
          a: ['Yes. We show clickable designs first, then working software you can test every week, so there are no surprises at the end.'],
        },
      ],
    },
    {
      id: 'after-launch',
      title: 'After launch',
      items: [
        {
          q: 'What happens after my product goes live?',
          a: [
            'We don’t hand over and disappear. Your team is trained from day one, and with a Partner or Care plan the people who built it keep monitoring, fixing and improving it.',
          ],
        },
        {
          q: 'Who owns the code and designs?',
          a: ['Ownership is set out in your project agreement. Our standard approach is that the work we make for you becomes yours once it is paid for.'],
        },
        {
          q: 'Can you take over software someone else built?',
          a: ['Often, yes. We start with a short review of what you have, then tell you honestly whether to support it, improve it or replace it.'],
        },
      ],
    },
    {
      id: 'ai-and-data',
      title: 'AI & your data',
      items: [
        {
          q: 'Is AI right for my business?',
          a: [
            'Only if it saves real time or money. We start with the work your team repeats every day, such as answering the same questions, processing documents or chasing invoices, and we only add AI where it clearly helps.',
          ],
        },
        {
          q: 'What happens to my business data?',
          a: [
            'We only use the data needed for your project, keep access to the people working on it, and agree in writing how it is stored and handled. For this website, see our [Privacy Policy](/privacy/).',
          ],
        },
        {
          q: 'Does this website track me?',
          a: ['No. There are no analytics or advertising cookies. The [Cookie Policy](/cookies/) explains the little that does happen.'],
        },
      ],
    },
  ],
};

export const legalNav = [
  {label: 'FAQ', href: '/faq/'},
  {label: 'Privacy', href: '/privacy/'},
  {label: 'Cookies', href: '/cookies/'},
  {label: 'Terms', href: '/terms/'},
];
