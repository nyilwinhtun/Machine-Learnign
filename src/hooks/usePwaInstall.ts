import { useCallback, useEffect, useState } from 'react';

export const PWA_DISMISS_STORAGE_KEY = 'ml_visual_pwa_dismissed_v1';

export interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt: () => Promise<void>;
}

interface NavigatorWithStandalone extends Navigator {
  standalone?: boolean;
}

function isStandaloneMode(): boolean {
  if (typeof window === 'undefined') return false;
  const mediaStandalone =
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(display-mode: standalone)').matches;
  const iosStandalone =
    (window.navigator as NavigatorWithStandalone).standalone === true;
  return mediaStandalone || iosStandalone;
}

function isIosSafariBrowser(): boolean {
  if (typeof window === 'undefined') return false;
  const ua = window.navigator.userAgent || '';
  const isIos =
    /iPad|iPhone|iPod/.test(ua) ||
    (ua.includes('Mac') && typeof document !== 'undefined' && 'ontouchend' in document);
  const isSafari =
    /Safari/.test(ua) && !/CriOS|FxiOS|EdgiOS|OPiOS|Chrome/.test(ua);
  return isIos && isSafari && !isStandaloneMode();
}

function loadDismissedState(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return window.localStorage.getItem(PWA_DISMISS_STORAGE_KEY) === 'true';
  } catch {
    return false;
  }
}

export interface UsePwaInstallResult {
  canShowBanner: boolean;
  isIosPrompt: boolean;
  isStandalone: boolean;
  promptInstall: () => Promise<void>;
  dismissBanner: () => void;
}

export function usePwaInstall(): UsePwaInstallResult {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isStandalone, setIsStandalone] = useState<boolean>(isStandaloneMode);
  const [isDismissed, setIsDismissed] = useState<boolean>(loadDismissedState);
  const [isIosTipVisible, setIsIosTipVisible] =
    useState<boolean>(isIosSafariBrowser);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setDeferredPrompt(null);
      setIsStandalone(true);
      setIsIosTipVisible(false);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    const mediaQuery =
      typeof window.matchMedia === 'function'
        ? window.matchMedia('(display-mode: standalone)')
        : null;

    const handleDisplayModeChange = (event: MediaQueryListEvent) => {
      if (event.matches) {
        setIsStandalone(true);
        setIsIosTipVisible(false);
        setDeferredPrompt(null);
      }
    };

    if (mediaQuery && typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', handleDisplayModeChange);
    }

    return () => {
      window.removeEventListener(
        'beforeinstallprompt',
        handleBeforeInstallPrompt
      );
      window.removeEventListener('appinstalled', handleAppInstalled);
      if (mediaQuery && typeof mediaQuery.removeEventListener === 'function') {
        mediaQuery.removeEventListener('change', handleDisplayModeChange);
      }
    };
  }, []);

  const promptInstall = useCallback(async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    if (choice.outcome === 'accepted') {
      setIsStandalone(true);
    }
  }, [deferredPrompt]);

  const dismissBanner = useCallback(() => {
    setIsDismissed(true);
    setDeferredPrompt(null);
    try {
      window.localStorage.setItem(PWA_DISMISS_STORAGE_KEY, 'true');
    } catch {
      // Ignore storage errors in restricted environments
    }
  }, []);

  const canShowBanner =
    !isStandalone && !isDismissed && (deferredPrompt !== null || isIosTipVisible);
  const isIosPrompt = deferredPrompt === null && isIosTipVisible;

  return {
    canShowBanner,
    isIosPrompt,
    isStandalone,
    promptInstall,
    dismissBanner,
  };
}
