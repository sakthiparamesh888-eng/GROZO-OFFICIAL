import { useState, useEffect, useRef } from 'react';

export default function BannerSlider({ banners = [] }) {
  const [index, setIndex] = useState(0);
  const timer = useRef(null);
  const count = banners.length;

  useEffect(() => {
    if (count <= 1) return;
    timer.current = setInterval(() => {
      setIndex((i) => (i + 1) % count);
    }, 4500);
    return () => clearInterval(timer.current);
  }, [count]);

  if (!count) return null;

  return (
    <div className="slider" aria-roledescription="carousel">
      <div
        className="slider-track"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {banners.map((b) => (
          <div className="slide" key={b.id}>
            <img src={b.image} alt={b.title || 'Offer banner'} loading="lazy" />
            {(b.title || b.subtitle) && (
              <div className="slide-caption">
                {b.title && <h3>{b.title}</h3>}
                {b.subtitle && <p>{b.subtitle}</p>}
              </div>
            )}
          </div>
        ))}
      </div>

      {count > 1 && (
        <div className="slider-dots">
          {banners.map((_, i) => (
            <button
              key={i}
              className={i === index ? 'active' : ''}
              onClick={() => setIndex(i)}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
