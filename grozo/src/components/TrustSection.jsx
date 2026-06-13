import { useEffect, useRef, useState } from 'react';
import { useSocialMedia } from '../hooks/useSocialMedia.jsx';
import {
  IconLeaf,
  IconStar,
  IconTruck,
  IconUsers
} from './icons.jsx';

const FALLBACK_METRICS = [
  { key: 'customers', title: 'Happy Customers', followers: '1000+', icon: 'users' },
  { key: 'orders', title: 'Orders Delivered', followers: '5000+', icon: 'orders' },
  { key: 'delivery', title: 'Delivery Charges', followers: '0', icon: 'truck' },
  { key: 'rating', title: 'Customer Rating', followers: '4.9', icon: 'star' },
  { key: 'farmers', title: 'Direct From Farmers', followers: '100%', icon: 'leaf' }
];

const ICONS = {
  users: IconUsers,
  customers: IconUsers,
  orders: IconLeaf,
  truck: IconTruck,
  delivery: IconTruck,
  star: IconStar,
  rating: IconStar,
  leaf: IconLeaf,
  farmers: IconLeaf
};

function AnimatedValue({ value }) {
  const ref = useRef(null);
  const [display, setDisplay] = useState('0');

  useEffect(() => {
    const text = String(value || '0');
    const match = text.match(/[\d,.]+/);
    const target = match ? Number(match[0].replace(/,/g, '')) : 0;
    const prefix = match ? text.slice(0, match.index) : '';
    const suffix = match ? text.slice(match.index + match[0].length) : text;
    let frame = 0;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        const started = performance.now();
        const duration = 1200;

        const tick = (now) => {
          const progress = Math.min((now - started) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          const current = target * eased;
          const formatted = Number.isInteger(target)
            ? Math.round(current).toLocaleString('en-IN')
            : current.toFixed(1);
          setDisplay(`${prefix}${formatted}${suffix}`);
          if (progress < 1) frame = requestAnimationFrame(tick);
        };

        frame = requestAnimationFrame(tick);
        observer.disconnect();
      },
      { threshold: 0.35 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [value]);

  return <span ref={ref}>{display}</span>;
}

export default function TrustSection() {
  const { metrics, config } = useSocialMedia();
  const items = metrics.length ? metrics.slice(0, 5) : FALLBACK_METRICS;

  return (
    <section className="section">
      <div className="container">
        <div className="trust trust-dynamic fade-up">
          <span className="section-eyebrow" style={{ color: 'var(--green-100)' }}>
            {config.trust_eyebrow || 'Fresh From Farmer'}
          </span>
          <h2>{config.trust_heading || 'Trusted by families who choose fresh'}</h2>
          <p>
            {config.trust_subheading ||
              'Real produce, honest prices and direct relationships with local farmers.'}
          </p>
          <div className="trust-stats trust-stats-dynamic">
            {items.map((item) => {
              const Icon = ICONS[String(item.icon || item.key).toLowerCase()] || IconLeaf;
              return (
                <div className="trust-stat" key={item.key || item.title}>
                  <span className="trust-stat-icon"><Icon /></span>
                  <div className="num">
                    <AnimatedValue value={item.followers} />
                  </div>
                  <div className="lbl">{item.title}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
