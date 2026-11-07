import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import Doc, {type DocSlug} from './pages/Doc';
import './index.css';

// Each policy page's HTML names itself: <body data-page="privacy">.
const slug = (document.body.dataset.page ?? 'faq') as DocSlug;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Doc slug={slug} />
  </StrictMode>,
);
