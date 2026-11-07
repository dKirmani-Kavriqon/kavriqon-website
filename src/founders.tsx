import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import Founders from './pages/Founders';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Founders />
  </StrictMode>,
);
