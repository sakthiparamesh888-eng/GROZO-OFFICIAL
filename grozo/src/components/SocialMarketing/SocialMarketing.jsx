import { memo } from 'react';
import { useSocialMedia } from '../../hooks/useSocialMedia.jsx';
import {
  IconArrow,
  IconInstagram,
  IconPlay,
  IconWhatsApp,
  IconYouTube
} from '../icons.jsx';
import './SocialMarketing.css';

const CARD_DEFAULTS = {
  instagram: {
    title: 'Follow Us On Instagram',
    url: "https://www.instagram.com/iamkaranraja",
    points: ['Daily Fresh Vegetable Updates', 'Farm Photos', 'Customer Reviews', 'Special Offers'],
    button: 'Follow Now'
  },
  youtube: {
    title: 'Watch Our Farm Videos',
     url: "https://youtube.com/@karanrajalifeupdates",
    points: ['Harvest Videos', 'Packing Process', 'Daily Arrivals', 'Farmer Stories'],
    button: 'Subscribe Now'
  },
  whatsapp: {
    title: 'Order Directly On WhatsApp',
    points: ['Instant Support', 'Quick Orders', 'Fast Response'],
    button: 'Chat Now'
  }
};

const ICONS = {
  instagram: IconInstagram,
  youtube: IconYouTube,
  whatsapp: IconWhatsApp
};

function SocialCard({ platform, profile }) {
  const defaults = CARD_DEFAULTS[platform];
  const Icon = ICONS[platform];
  const points = profile?.points?.length ? profile.points : defaults.points;
 const href =
  profile?.url ||
  defaults?.url ||
  '#social-media';

  return (
    <article className={`social-card social-card-${platform}`}>
      <div className="social-card-top">
        <span className="social-card-icon">
          <Icon />
        </span>
        {profile?.followers && (
          <span className="social-followers">{profile.followers}</span>
        )}
      </div>
      <h3>{profile?.title || defaults.title}</h3>
      <ul>
        {points.map((point) => (
          <li key={point}>{point}</li>
        ))}
      </ul>
      <a
        className="social-card-cta"
        href={href}
        target={href.startsWith('http') ? '_blank' : undefined}
        rel={href.startsWith('http') ? 'noreferrer' : undefined}
      >
        {profile?.buttonText || defaults.button}
        <IconArrow />
      </a>
    </article>
  );
}

function MediaRail({ title, items, platform }) {
  if (!items.length) return null;

  return (
    <div className="social-media-rail">
      <div className="social-media-rail-head">
        <h3>{title}</h3>
        <span>{items.length} latest</span>
      </div>
      <div className="social-media-grid">
        {items.slice(0, 4).map((item, index) => (
          <a
            className="social-media-tile"
            href={item.url}
            target="_blank"
            rel="noreferrer"
            key={`${item.platform}-${item.url}-${index}`}
          >
            <div className="social-media-thumb">
              <img src={item.thumbnail} alt="" loading="lazy" decoding="async" />
              <span className={`social-media-play ${platform}`}>
                {platform === 'instagram' ? <IconInstagram /> : <IconPlay />}
              </span>
            </div>
            <div className="social-media-copy">
              <strong>{item.title}</strong>
              <span>{platform === 'instagram' ? 'View Reel' : 'Watch Video'} →</span>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

function SocialMarketing() {
  const { profiles, content, config } = useSocialMedia();
  const instagramItems = content.filter(
    (item) => item.platform === 'instagram_reel' && item.thumbnail && item.url
  );
  const youtubeItems = content.filter(
    (item) => item.platform === 'youtube_video' && item.thumbnail && item.url
  );

  return (
    <section className="social-marketing section" id="social-media">
      <div className="container">
        <div className="social-marketing-shell">
          <span className="social-orb social-orb-one" aria-hidden="true" />
          <span className="social-orb social-orb-two" aria-hidden="true" />

          <div className="social-marketing-heading">
            <span className="social-marketing-eyebrow">
              {config.eyebrow || 'Fresh updates, every day'}
            </span>
            <h2>{config.heading || 'Join The GROZO Family'}</h2>
            <p>
              {config.subheading ||
                'Get daily fresh arrival updates, farm videos, offers and market prices directly from our farms.'}
            </p>
          </div>

          <div className="social-card-grid">
            {['instagram', 'youtube', 'whatsapp'].map((platform) => (
              <SocialCard
                key={platform}
                platform={platform}
                profile={profiles[platform]}
              />
            ))}
          </div>

          <MediaRail
            title={config.instagram_heading || 'Latest Instagram Reels'}
            items={instagramItems}
            platform="instagram"
          />
          <MediaRail
            title={config.youtube_heading || 'Latest From GROZO Farms'}
            items={youtubeItems}
            platform="youtube"
          />
        </div>
      </div>
    </section>
  );
}

export default memo(SocialMarketing);
