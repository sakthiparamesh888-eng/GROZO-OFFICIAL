// =============================================================
//  Settings provider — loads the Settings sheet once and shares
//  it across the app (site name, phone, whatsapp, hero text...).
// =============================================================

import { createContext, useContext } from 'react';
import { getSettings } from '../services/api.js';
import { settingsToObject } from '../utils/format.js';
import { FALLBACK_SETTINGS } from '../config.js';
import { useFetch } from './useFetch.js';

const SettingsContext = createContext({ settings: FALLBACK_SETTINGS, loading: true });

export function SettingsProvider({ children }) {
  const { data, loading } = useFetch(getSettings, []);
  const settings = data
    ? { ...FALLBACK_SETTINGS, ...settingsToObject(data) }
    : FALLBACK_SETTINGS;

  return (
    <SettingsContext.Provider value={{ settings, loading }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  return useContext(SettingsContext);
}
