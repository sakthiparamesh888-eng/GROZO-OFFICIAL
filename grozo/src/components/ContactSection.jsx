import { useSettings } from '../hooks/useSettings.js';
import { IconMapPin, IconPhone, IconWhatsApp } from './icons.jsx';

export default function ContactSection() {
  const { settings } = useSettings();
  const wa = String(settings.whatsapp || '').replace(/[^0-9]/g, '');

  return (
    <section className="section" id="contact">
      <div className="container">
        <div className="section-head">
          <div>
            <span className="section-eyebrow">Get in touch</span>
            <h2 className="section-title">Order or ask us anything</h2>
          </div>
        </div>
        <div className="contact-grid">
          {settings.address && (
            <div className="contact-card">
              <span className="ci">
                <IconMapPin />
              </span>
              <div>
                <div className="lbl">Address</div>
                <div className="val">{settings.address}</div>
              </div>
            </div>
          )}
          {settings.phone && (
            <a className="contact-card" href={`tel:${settings.phone}`}>
              <span className="ci">
                <IconPhone />
              </span>
              <div>
                <div className="lbl">Call</div>
                <div className="val">{settings.phone}</div>
              </div>
            </a>
          )}
          {wa && (
            <a
              className="contact-card"
              href={`https://wa.me/${wa}`}
              target="_blank"
              rel="noreferrer"
            >
              <span className="ci" style={{ color: '#25d366' }}>
                <IconWhatsApp />
              </span>
              <div>
                <div className="lbl">WhatsApp</div>
                <div className="val">Message us to order</div>
              </div>
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
