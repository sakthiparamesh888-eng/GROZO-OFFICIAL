import { Link } from 'react-router-dom';
import logo from '../assets/logo.svg';
import { useSettings } from '../hooks/useSettings.js';
import { IconMapPin, IconPhone, IconWhatsApp } from './icons.jsx';

export default function Footer() {
  const { settings } = useSettings();
  const name = settings.site_name || 'GROZO';
  const year = new Date().getFullYear();
  const wa = String(settings.whatsapp || '').replace(/[^0-9]/g, '');

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div className="footer-brand">
              <img src={logo} alt="" />
              <span className="brand-name">{name}</span>
            </div>
            <p>{settings.hero_subtitle}</p>
            {settings.delivery_message && (
              <p style={{ marginTop: 8, color: 'var(--green-400)', fontWeight: 600 }}>
                🌿 {settings.delivery_message}
              </p>
            )}
          </div>

          <div>
            <h4>Contact</h4>
            <div className="footer-links">
              {settings.address && (
                <span style={{ display: 'flex', gap: 6 }}>
                  <IconMapPin style={{ width: 16, height: 16, flexShrink: 0 }} />
                  {settings.address}
                </span>
              )}
              {settings.phone && (
                <a href={`tel:${settings.phone}`} style={{ display: 'flex', gap: 6 }}>
                  <IconPhone style={{ width: 16, height: 16 }} /> {settings.phone}
                </a>
              )}
              {wa && (
                <a
                  href={`https://wa.me/${wa}`}
                  target="_blank"
                  rel="noreferrer"
                  style={{ display: 'flex', gap: 6 }}
                >
                  <IconWhatsApp style={{ width: 16, height: 16 }} /> WhatsApp
                </a>
              )}
            </div>
          </div>

          <div>
            <h4>Shop</h4>
            <div className="footer-links">
              <Link to="/">Home</Link>
              <Link to="/cart">Cart</Link>
              <Link to="/search?q=fresh">All Products</Link>
              <a href="#why-choose-us">Why Choose Us</a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          © {year} {name}. Fresh from farmer, straight to you.
        </div>
      </div>
    </footer>
  );
}
