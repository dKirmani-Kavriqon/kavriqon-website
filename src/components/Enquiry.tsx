import {useState, type FormEvent} from 'react';
import {brand, enquiry, services} from '../content';
import {useReveals} from '../hooks/useReveals';
import {useStudioClock} from '../hooks/useStudioClock';
import {sendEnquiry} from '../lib/enquiry';

type Status = 'idle' | 'invalid' | 'sending' | 'sent' | 'error';

/**
 * The enquiry. Left: the studio clock ticking in Srinagar (the countdown's
 * place in the original layout). Right: the form. Submission is unchanged
 * from the live site — same Worker, same JSON — only the interface is new.
 */
export function Enquiry() {
  const ref = useReveals<HTMLElement>();
  const t = useStudioClock();
  const [status, setStatus] = useState<Status>('idle');

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    if (String(data.get('_honey') ?? '')) return;
    if (!form.checkValidity()) {
      setStatus('invalid');
      form.reportValidity();
      return;
    }
    setStatus('sending');
    try {
      await sendEnquiry({
        name: String(data.get('name') ?? '').trim(),
        email: String(data.get('email') ?? '').trim(),
        phone: String(data.get('phone') ?? '').trim(),
        service: String(data.get('service') ?? '').trim(),
        message: String(data.get('message') ?? '').trim(),
        website: '',
      });
      form.reset();
      setStatus('sent');
    } catch {
      setStatus('error');
    }
  };

  const field =
    'w-full min-h-12 rounded-[8px] bg-white/[0.04] px-4 py-3 text-body text-white ring-1 ring-line outline-none transition-shadow placeholder:text-subtle focus:ring-2 focus:ring-bronze user-invalid:ring-red-400';
  const label = 'mb-2 block font-mono text-label text-muted uppercase';
  const units: [string, string][] = [
    ['Hrs', t.h],
    ['Min', t.m],
    ['Sec', t.s],
  ];

  return (
    <section ref={ref} id="contact" aria-labelledby="contact-title" className="relative overflow-hidden bg-void px-4 pb-28 sm:px-6 md:px-[6vw] md:pb-40">
      {/* A sliver of the sun rising at the bottom edge — the hero, bookended. */}
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-[62vw] left-1/2 size-[90vw] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_50%_30%,rgba(224,185,140,0.3),rgba(224,185,140,0.05)_55%,transparent_70%)]" />

      <div className="relative grid gap-12 border-t border-line pt-20 md:grid-cols-2 md:gap-16 md:pt-28">
        <div data-reveal>
          <p className="font-mono text-label text-bronze uppercase">{enquiry.eyebrow}</p>
          <h2 id="contact-title" className="mt-4 font-display text-display text-white">
            {enquiry.heading}
          </h2>
          <p className="mt-5 max-w-[28rem] text-body text-muted">{enquiry.body}</p>

          <div className="mt-10">
            <p className="font-mono text-label text-muted uppercase">{enquiry.clockLabel}</p>
            <div className="mt-3 flex gap-2 md:gap-3" role="timer" aria-label={`${t.h}:${t.m} in Srinagar`}>
              {units.map(([u, v]) => (
                <div key={u} className="brackets min-w-[4.5rem] px-3 py-3 text-center text-white/30 md:min-w-[5.5rem]" aria-hidden="true">
                  <span className="block font-display text-[1.5rem] text-white tabular-nums md:text-[2.25rem]">{v}</span>
                  <span className="mt-1 block font-mono text-[0.6875rem] tracking-[0.14em] text-muted uppercase">{u}</span>
                </div>
              ))}
            </div>
            <p className="mt-6 flex items-center gap-3 text-[0.9375rem] text-muted">
              <span className="relative flex size-2.5">
                <span className="motion-loop absolute inset-0 animate-ping rounded-full bg-live/70" />
                <span className="relative size-2.5 rounded-full bg-live" />
              </span>
              Every enquiry is read by a person on the team.
            </p>
          </div>
        </div>

        <form noValidate onSubmit={onSubmit} aria-describedby="contact-status" className="space-y-4" data-reveal>
          <input type="text" name="_honey" tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute -left-[9999px] size-px opacity-0" />
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className={label}>Your name</span>
              <input name="name" required maxLength={100} autoComplete="name" placeholder="Full name" className={field} onInput={() => setStatus('idle')} />
            </label>
            <label className="block">
              <span className={label}>Email</span>
              <input name="email" type="email" required maxLength={160} autoComplete="email" placeholder="you@company.com" className={field} onInput={() => setStatus('idle')} />
            </label>
          </div>
          <label className="block">
            <span className={label}>
              Phone or WhatsApp <span className="text-subtle normal-case tracking-normal">· optional</span>
            </span>
            <input name="phone" type="tel" maxLength={30} autoComplete="tel" placeholder="+91 98765 43210" className={field} />
          </label>
          <label className="block">
            <span className={label}>What do you need?</span>
            <span className="relative block">
              <select name="service" required defaultValue="" className={`${field} appearance-none pr-12`}>
                <option value="" disabled className="bg-void">
                  Choose a service
                </option>
                {services.items.map((s) => (
                  <option key={s.slug} value={s.value} className="bg-void">
                    {s.value}
                  </option>
                ))}
                <option value={enquiry.notSure} className="bg-void">
                  {enquiry.notSure}
                </option>
              </select>
              <span aria-hidden="true" className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-muted">
                ⌄
              </span>
            </span>
          </label>
          <label className="block">
            <span className={label}>About your project</span>
            <textarea name="message" required minLength={10} maxLength={3000} rows={5} placeholder="What's the challenge, idea or outcome you're working towards?" className={`${field} resize-y`} onInput={() => setStatus('idle')} />
          </label>
          <button
            type="submit"
            disabled={status === 'sending'}
            className="mt-2 inline-flex min-h-13 w-full items-center justify-center gap-2 rounded-full bg-white px-5 font-mono text-label text-void uppercase transition-colors hover:bg-bronze disabled:opacity-60"
          >
            {status === 'sending' ? 'Sending…' : 'Send enquiry'} <span aria-hidden="true">→</span>
          </button>
          <p
            id="contact-status"
            role="status"
            className={`min-h-[1.5rem] text-[0.9375rem] ${status === 'sent' ? 'text-live' : status === 'error' || status === 'invalid' ? 'text-red-300' : 'text-muted'}`}
          >
            {status === 'invalid' && 'Please add your name, a valid email, a service and a few words about the project.'}
            {status === 'sent' && 'Thank you — your enquiry is with the team. A real person will reply soon.'}
            {status === 'error' && (
              <>
                We couldn't send that just now. Please try again in a moment, or reach us on{' '}
                <a href={brand.linkedin} target="_blank" rel="noopener" className="underline underline-offset-4">
                  LinkedIn
                </a>
                .
              </>
            )}
          </p>
          <p className="text-[0.8125rem] text-subtle">By sending this form, you agree that we may contact you about your enquiry.</p>
        </form>
      </div>
    </section>
  );
}
