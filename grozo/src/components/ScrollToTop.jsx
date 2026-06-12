import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useSettings } from '../hooks/useSettings.jsx';
import { IconWhatsApp } from './icons.jsx';

export function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' });
  }, [pathname]);
  return null;
}

export function FloatingWhatsApp() {
  const { settings } = useSettings();
  const wa = String(settings.whatsapp || '').replace(/[^0-9]/g, '');
  if (!wa) return null;
  return (
    <a
      className="fab-whatsapp"
      href={`https://wa.me/${wa}`}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat with us on WhatsApp"
    >
      <IconWhatsApp />
    </a>
  );
}
