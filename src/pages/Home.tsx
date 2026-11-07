import {useEffect} from 'react';
import {Footer, Header} from '../components/Chrome';
import {Daybreak} from '../components/Daybreak';
import {Engage} from '../components/Engage';
import {Enquiry} from '../components/Enquiry';
import {Intro} from '../components/Intro';
import {Process} from '../components/Process';
import {ServicesReel} from '../components/ServicesReel';
import {useReducedMotion} from '../hooks/useReducedMotion';
import {scrollToHash, startScroll} from '../lib/scroll';

export default function Home() {
  const reduced = useReducedMotion();
  useEffect(() => startScroll(reduced), [reduced]);

  // Arriving from another page with a hash (e.g. /#contact from Founders).
  useEffect(() => {
    const hash = window.location.hash;
    if (!hash || hash === '#top') return;
    const id = window.setTimeout(() => scrollToHash(hash), 120);
    return () => window.clearTimeout(id);
  }, []);

  return (
    <>
      <a href="#main" className="sr-only z-[60] rounded bg-white px-4 py-3 text-void focus:not-sr-only focus:fixed focus:top-3 focus:left-3">
        Skip to content
      </a>
      <Header page="home" />
      <main id="main">
        <Daybreak />
        <Intro />
        <ServicesReel />
        <Process />
        <Engage />
        <Enquiry />
      </main>
      <Footer page="home" />
    </>
  );
}
