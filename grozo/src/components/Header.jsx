import { Link } from 'react-router-dom';
import logo from '../assets/logo.svg';
import SearchBar from './SearchBar.jsx';
import { useCart } from '../context/CartContext.jsx';
import { useSettings } from '../hooks/useSettings.js';
import { IconCart, IconPhone, IconWhatsApp } from './icons.jsx';

export default function Header() {
  const { count } = useCart();
  const { settings } = useSettings();

  const phone = settings.phone;
  const wa = settings.whatsapp;
  const name = settings.site_name || 'GROZO';

  // Split name so the last bit gets the accent colour (e.g. GRO + ZO).
  const split = Math.ceil(name.length / 2);
  const head = name.slice(0, split);
  const tail = name.slice(split);

  return (
    <header className="header">
      <div className="container header-bar">
        <Link to="/" className="brand" aria-label={`${name} home`}>
          <img src={logo} alt="" />
          <span className="brand-name">
            {head}
            <span>{tail}</span>
          </span>
        </Link>

        <SearchBar />

        <div className="header-actions">
          {phone && (
            <a
              href={`tel:${phone}`}
              className="icon-btn"
              aria-label="Call us"
              title="Call us"
            >
              <IconPhone />
            </a>
          )}
          {wa && (
            <a
              href={`https://wa.me/${String(wa).replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noreferrer"
              className="icon-btn"
              aria-label="Chat on WhatsApp"
              title="WhatsApp"
              style={{ color: '#25d366' }}
            >
              <IconWhatsApp />
            </a>
          )}
          <Link to="/cart" className="icon-btn" aria-label={`Cart, ${count} items`}>
            <IconCart />
            {count > 0 && <span className="cart-count">{count}</span>}
          </Link>
        </div>
      </div>
    </header>
  );
}
