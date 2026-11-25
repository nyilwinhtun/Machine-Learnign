import { useCallback, useState } from 'react';
import { ApiSettings, ApiSettingsSchema } from '../schemas/mlSchemas';

export const API_SETTINGS_STORAGE_KEY = 'ml_visual_study_api_settings_v1';

export const DEFAULT_API_SETTINGS: ApiSettings = {
  provider: 'gemini',
  geminiApiKey: '',
  geminiModel: 'gemini-2.5-flash',
  openRouterApiKey: '',
  openRouterModel: 'google/gemini-2.5-flash',
};

function loadApiSettings(): ApiSettings {
  try {
    const raw = window.localStorage.getItem(API_SETTINGS_STORAGE_KEY);
    if (!raw) return DEFAULT_API_SETTINGS;
    const parsed: unknown = JSON.parse(raw);
    const result = ApiSettingsSchema.safeParse(parsed);
    return result.success ? result.data : DEFAULT_API_SETTINGS;
  } catch {
    return DEFAULT_API_SETTINGS;
  }
}

/**
 * Hook for managing Gemini and OpenRouter API settings in localStorage with Zod validation.
 */
export function useApiSettings() {
  const [settings, setSettings] = useState<ApiSettings>(loadApiSettings);

  const saveSettings = useCallback((nextSettings: ApiSettings) => {
    const validated = ApiSettingsSchema.parse(nextSettings);
    setSettings(validated);
    try {
      window.localStorage.setItem(
        API_SETTINGS_STORAGE_KEY,
        JSON.stringify(validated)
      );
    } catch {
      // Ignore storage quota errors in restricted environments
    }
    return validated;
  }, []);

  const clearSettings = useCallback(() => {
    setSettings(DEFAULT_API_SETTINGS);
    try {
      window.localStorage.removeItem(API_SETTINGS_STORAGE_KEY);
    } catch {
      // Ignore storage errors
    }
  }, []);

  const hasActiveKey =
    settings.provider === 'gemini'
      ? settings.geminiApiKey.trim().length > 0
      : settings.openRouterApiKey.trim().length > 0;

  return {
    settings,
    saveSettings,
    clearSettings,
    hasActiveKey,
  };
}
