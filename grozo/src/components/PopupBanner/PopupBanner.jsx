import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './PopupBanner.css';

const SESSION_KEY = 'grozo:popup-banner-shown';
const OPEN_DELAY = 1000;
const CLOSE_DURATION = 320;

function PopupBanner({
  title,
  subtitle,
  description,
  buttonText,
  image,
  buttonLink
}) {
  const navigate = useNavigate();
  const closeButtonRef = useRef(null);
  const closeTimerRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const closePopup = useCallback((onClosed) => {
    if (isClosing) return;

    setIsClosing(true);
    closeTimerRef.current = window.setTimeout(() => {
      setIsVisible(false);
      setIsClosing(false);
      onClosed?.();
    }, CLOSE_DURATION);
  }, [isClosing]);

  useEffect(() => {
    let hasBeenShown = false;

    try {
      hasBeenShown = sessionStorage.getItem(SESSION_KEY) === 'true';
    } catch {
      // The popup can still work when storage is unavailable.
    }

    if (hasBeenShown) return undefined;

    const openTimer = window.setTimeout(() => {
      try {
        sessionStorage.setItem(SESSION_KEY, 'true');
      } catch {
        // Ignore privacy-mode storage failures.
      }

      setIsVisible(true);
    }, OPEN_DELAY);

    return () => window.clearTimeout(openTimer);
  }, []);

  useEffect(() => {
    if (!isVisible) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') closePopup();
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [closePopup, isVisible]);

  useEffect(
    () => () => {
      if (closeTimerRef.current) window.clearTimeout(closeTimerRef.current);
    },
    []
  );

  const handleOverlayClick = (event) => {
    if (event.target === event.currentTarget) closePopup();
  };

  const handleCtaClick = () => {
    closePopup(() => navigate(buttonLink));
  };

  if (!isVisible) return null;

  return (
    <div
      className={`popup-banner-overlay${isClosing ? ' is-closing' : ''}`}
      onMouseDown={handleOverlayClick}
      role="presentation"
    >
      <span className="popup-particle popup-particle-one" aria-hidden="true" />
      <span className="popup-particle popup-particle-two" aria-hidden="true" />
      <span className="popup-particle popup-particle-three" aria-hidden="true" />

      <section
        className="popup-banner"
        role="dialog"
        aria-modal="true"
        aria-labelledby="popup-banner-title"
        aria-describedby="popup-banner-description"
      >
        <button
          ref={closeButtonRef}
          className="popup-banner-close"
          type="button"
          onClick={() => closePopup()}
          aria-label="Close promotion"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M6 6l12 12M18 6 6 18" />
          </svg>
        </button>

        <div className="popup-banner-media">
          <div className="popup-banner-image-wrap">
            <img src={image} alt="" loading="lazy" decoding="async" />
          </div>
          <span className="popup-banner-badge">{subtitle}</span>
        </div>

        <div className="popup-banner-content">
          <p className="popup-banner-kicker">{subtitle}</p>
          <h2 id="popup-banner-title">{title}</h2>
          <p id="popup-banner-description" className="popup-banner-description">
            {description}
          </p>
          <button
            className="popup-banner-cta"
            type="button"
            onClick={handleCtaClick}
          >
            <span>{buttonText}</span>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </button>
        </div>
      </section>
    </div>
  );
}

export default memo(PopupBanner);
