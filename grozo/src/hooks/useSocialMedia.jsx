import { createContext, useContext, useMemo } from 'react';
import { getSocialMedia } from '../services/api.js';
import { useFetch } from './useFetch.js';
import { useSettings } from './useSettings.jsx';

const SocialMediaContext = createContext({
  profiles: {},
  content: [],
  metrics: [],
  config: {},
  loading: true
});

const cleanPlatform = (value) =>
  String(value || '').trim().toLowerCase().replace(/[\s-]+/g, '_');

const isActive = (value) => {
  if (value === false) return false;
  const normalized = String(value ?? '').trim().toLowerCase();
  return !['false', '0', 'no', 'n'].includes(normalized);
};

const splitTitle = (value) => {
  const parts = String(value || '')
    .split('|')
    .map((part) => part.trim())
    .filter(Boolean);

  return {
    title: parts[0] || '',
    points: parts.slice(1)
  };
};

export function SocialMediaProvider({ children }) {
  const { settings } = useSettings();
  const { data, loading } = useFetch(getSocialMedia, []);

  const value = useMemo(() => {
    const rows = Array.isArray(data) ? data.filter((row) => isActive(row.active)) : [];
    const profiles = {};
    const content = [];
    const metrics = [];
    const config = {};

    rows.forEach((row) => {
      const platform = cleanPlatform(row.platform);
      const parsedTitle = splitTitle(row.title);
      const normalized = { ...row, ...parsedTitle, platform };

      if (platform.startsWith('config_')) {
        config[platform.slice(7)] = row.title || '';
      } else if (platform.startsWith('metric_')) {
        metrics.push({ ...normalized, key: platform.slice(7) });
      } else if (
        platform === 'instagram_reel' ||
        platform === 'youtube_video' ||
        platform === 'testimonial'
      ) {
        content.push(normalized);
      } else if (platform) {
        profiles[platform] = normalized;
      }
    });

    if (!profiles.whatsapp && settings.whatsapp) {
      profiles.whatsapp = {
        platform: 'whatsapp',
        title: 'Order Directly On WhatsApp',
        url: `https://wa.me/${String(settings.whatsapp).replace(/\D/g, '')}`,
        points: []
      };
    }

    if (!profiles.call && settings.phone) {
      profiles.call = {
        platform: 'call',
        title: 'Call GROZO',
        url: `tel:${String(settings.phone).replace(/[^\d+]/g, '')}`,
        points: []
      };
    }

    return { profiles, content, metrics, config, loading };
  }, [data, loading, settings.phone, settings.whatsapp]);

  return (
    <SocialMediaContext.Provider value={value}>
      {children}
    </SocialMediaContext.Provider>
  );
}

export function useSocialMedia() {
  return useContext(SocialMediaContext);
}
