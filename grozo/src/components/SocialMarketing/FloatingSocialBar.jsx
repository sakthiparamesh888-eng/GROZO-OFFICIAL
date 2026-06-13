import { memo } from 'react';
import { useSocialMedia } from '../../hooks/useSocialMedia.jsx';
import {
  IconInstagram,
  IconPhone,
  IconWhatsApp,
  IconYouTube
} from '../icons.jsx';

const ITEMS = [
  ['instagram', 'Instagram', IconInstagram],
  ['youtube', 'YouTube', IconYouTube],
  ['whatsapp', 'WhatsApp', IconWhatsApp],
  ['call', 'Call', IconPhone]
];

function FloatingSocialBar() {
  const { profiles } = useSocialMedia();
  const visible = ITEMS.filter(([platform]) => profiles[platform]?.url);

  if (!visible.length) return null;

  return (
    <nav className="floating-social-bar" aria-label="Contact and social links">
      {visible.map(([platform, label, Icon]) => {
        const href = profiles[platform].url;
        const external = href.startsWith('http');
        return (
          <a
            key={platform}
            className={`floating-social-link ${platform}`}
            href={href}
            target={external ? '_blank' : undefined}
            rel={external ? 'noreferrer' : undefined}
            aria-label={label}
          >
            <Icon />
            <span>{label}</span>
          </a>
        );
      })}
    </nav>
  );
}

export default memo(FloatingSocialBar);
