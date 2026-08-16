import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource/instrument-serif/400.css';
import '@fontsource/instrument-serif/400-italic.css';
import '@fontsource-variable/manrope';
import App from './App';
import './styles.css';

const PrototypeApp = import.meta.env.DEV && new URLSearchParams(location.search).get('prototype') === '1'
  ? (await import('./prototype/PrototypeApp')).default
  : App;

createRoot(document.getElementById('root')!).render(
  <StrictMode><PrototypeApp /></StrictMode>,
);
