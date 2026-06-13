import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { useSocialMedia } from '../../hooks/useSocialMedia.jsx';
import {
  IconClose,
  IconInstagram,
  IconWhatsApp,
  IconYouTube
} from '../icons.jsx';

const SESSION_KEY = 'grozo:social-exit-intent-shown';

function ExitIntentPopup() {
  const { profiles, config } = useSocialMedia();
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const closeTimer = useRef(null);
  const removeListener = useRef(null);

  const openPopup = useCallback(() => {
    if (document.querySelector('[role="dialog"]')) return;

    try {
      if (sessionStorage.getItem(SESSION_KEY)) return;
      sessionStorage.setItem(SESSION_KEY, 'true');
    } catch {
      // Continue when browser privacy settings block session storage.
    }
    setIsOpen(true);
  }, []);

  const closePopup = useCallback(() => {
    setIsClosing(true);
    closeTimer.current = window.setTimeout(() => {
      setIsOpen(false);
      setIsClosing(false);
    }, 260);
  }, []);

  useEffect(() => {
    const enableTimer = window.setTimeout(() => {
      const handleMouseLeave = (event) => {
        if (event.clientY <= 0) openPopup();
      };
      document.addEventListener('mouseleave', handleMouseLeave);

      removeListener.current = () =>
        document.removeEventListener('mouseleave', handleMouseLeave);
    }, 5000);

    return () => {
      window.clearTimeout(enableTimer);
      removeListener.current?.();
      if (closeTimer.current) window.clearTimeout(closeTimer.current);
    };
  }, [openPopup]);

  useEffect(() => {
    if (!isOpen) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') closePopup();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [closePopup, isOpen]);

  if (!isOpen) return null;

  const actions = [
    ['instagram', 'Instagram', IconInstagram],
    ['youtube', 'YouTube', IconYouTube],
    ['whatsapp', 'WhatsApp', IconWhatsApp]
  ].filter(([platform]) => profiles[platform]?.url);

  return (
    <div
      className={`social-exit-overlay${isClosing ? ' is-closing' : ''}`}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) closePopup();
      }}
    >
      <section
        className="social-exit-popup"
        role="dialog"
        aria-modal="true"
        aria-labelledby="social-exit-title"
      >
        <button
          className="social-exit-close"
          type="button"
          onClick={closePopup}
          aria-label="Close"
        >
          <IconClose />
        </button>
        <span className="social-exit-leaf" aria-hidden="true">🌿</span>
        <p className="social-exit-kicker">
          {config.exit_eyebrow || 'One fresh thing before you leave'}
        </p>
        <h2 id="social-exit-title">
          {config.exit_heading || 'Wait Before You Go!'}
        </h2>
        <p>
          {config.exit_subheading ||
            'Follow GROZO for daily fresh stock updates, farm videos and exclusive offers.'}
        </p>
        <div className="social-exit-actions">
          {actions.map(([platform, label, Icon]) => (
            <a
              key={platform}
              className={platform}
              href={profiles[platform].url}
              target="_blank"
              rel="noreferrer"
              onClick={closePopup}
            >
              <Icon />
              {label}
            </a>
          ))}
        </div>
        <button className="social-exit-continue" type="button" onClick={closePopup}>
          Continue Shopping
        </button>
      </section>
    </div>
  );
}

export default memo(ExitIntentPopup);
