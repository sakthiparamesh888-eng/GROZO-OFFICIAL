import { useSocialMedia } from '../../hooks/useSocialMedia.jsx';
import { IconInstagram, IconWhatsApp, IconYouTube } from '../icons.jsx';

const ITEMS = [
  ['instagram', 'Instagram', IconInstagram],
  ['youtube', 'YouTube', IconYouTube],
  ['whatsapp', 'WhatsApp', IconWhatsApp]
];

export default function HeroSocialLinks() {
  const { profiles } = useSocialMedia();
  const visible = ITEMS.filter(([platform]) => profiles[platform]?.url);

  if (!visible.length) return null;

  return (
    <div className="hero-social-links" aria-label="Follow GROZO">
      <span>Follow Us</span>
      {visible.map(([platform, label, Icon]) => (
        <a
          key={platform}
          href={profiles[platform].url}
          target="_blank"
          rel="noreferrer"
          aria-label={label}
          title={label}
        >
          <Icon />
        </a>
      ))}
    </div>
  );
}
