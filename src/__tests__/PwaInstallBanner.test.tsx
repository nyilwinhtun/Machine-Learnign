import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { PwaInstallBanner } from '../components/PwaInstallBanner';
import {
  BeforeInstallPromptEvent,
  PWA_DISMISS_STORAGE_KEY,
} from '../hooks/usePwaInstall';

function createBeforeInstallPromptEvent(
  outcome: 'accepted' | 'dismissed' = 'accepted'
): BeforeInstallPromptEvent & { prompt: jest.Mock } {
  const event = new Event('beforeinstallprompt', {
    cancelable: true,
  }) as BeforeInstallPromptEvent & { prompt: jest.Mock };

  Object.defineProperty(event, 'platforms', {
    value: ['web'],
    configurable: true,
  });

  const promptMock = jest.fn().mockResolvedValue(undefined);
  Object.defineProperty(event, 'prompt', {
    value: promptMock,
    configurable: true,
  });

  Object.defineProperty(event, 'userChoice', {
    value: Promise.resolve({ outcome, platform: 'web' }),
    configurable: true,
  });

  return event;
}

describe('PwaInstallBanner', () => {
  const originalMatchMedia = window.matchMedia;
  const originalUserAgent = window.navigator.userAgent;

  beforeEach(() => {
    window.localStorage.clear();
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      configurable: true,
      value: jest.fn().mockImplementation((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });
    Object.defineProperty(window.navigator, 'userAgent', {
      writable: true,
      configurable: true,
      value: 'Mozilla/5.0 (Linux; Android 13) Chrome/120.0.0.0 Mobile Safari/537.36',
    });
  });

  afterEach(() => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      configurable: true,
      value: originalMatchMedia,
    });
    Object.defineProperty(window.navigator, 'userAgent', {
      writable: true,
      configurable: true,
      value: originalUserAgent,
    });
  });

  it('does not render when no install prompt is available', () => {
    render(<PwaInstallBanner language="en" />);
    expect(
      screen.queryByRole('region', { name: /Install app banner/i })
    ).not.toBeInTheDocument();
  });

  it('shows the banner on beforeinstallprompt and calls prompt() when Install is clicked', async () => {
    render(<PwaInstallBanner language="en" />);

    const promptEvent = createBeforeInstallPromptEvent('accepted');
    const preventDefaultSpy = jest.spyOn(promptEvent, 'preventDefault');

    act(() => {
      window.dispatchEvent(promptEvent);
    });

    expect(preventDefaultSpy).toHaveBeenCalledTimes(1);
    expect(
      screen.getByText(/Install ML Visual Study Companion/i)
    ).toBeInTheDocument();

    const installButton = screen.getByRole('button', { name: /^Install$/i });
    fireEvent.click(installButton);

    await waitFor(() => {
      expect(promptEvent.prompt).toHaveBeenCalledTimes(1);
    });

    await waitFor(() => {
      expect(
        screen.queryByRole('region', { name: /Install app banner/i })
      ).not.toBeInTheDocument();
    });
  });

  it('dismisses the banner and persists dismissal in localStorage', () => {
    const { unmount } = render(<PwaInstallBanner language="en" />);

    const promptEvent = createBeforeInstallPromptEvent();
    act(() => {
      window.dispatchEvent(promptEvent);
    });

    const dismissButton = screen.getByRole('button', { name: /Dismiss/i });
    fireEvent.click(dismissButton);

    expect(
      screen.queryByRole('region', { name: /Install app banner/i })
    ).not.toBeInTheDocument();
    expect(window.localStorage.getItem(PWA_DISMISS_STORAGE_KEY)).toBe('true');

    unmount();

    // Re-mounting should stay hidden even if beforeinstallprompt fires again
    render(<PwaInstallBanner language="en" />);
    act(() => {
      window.dispatchEvent(createBeforeInstallPromptEvent());
    });
    expect(
      screen.queryByRole('region', { name: /Install app banner/i })
    ).not.toBeInTheDocument();
  });

  it('hides the banner when already running in standalone mode', () => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      configurable: true,
      value: jest.fn().mockImplementation((query: string) => ({
        matches: query === '(display-mode: standalone)',
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });

    render(<PwaInstallBanner language="en" />);

    act(() => {
      window.dispatchEvent(createBeforeInstallPromptEvent());
    });

    expect(
      screen.queryByRole('region', { name: /Install app banner/i })
    ).not.toBeInTheDocument();
  });

  it('hides the banner when appinstalled event is dispatched', () => {
    render(<PwaInstallBanner language="en" />);

    act(() => {
      window.dispatchEvent(createBeforeInstallPromptEvent());
    });

    expect(
      screen.getByRole('region', { name: /Install app banner/i })
    ).toBeInTheDocument();

    act(() => {
      window.dispatchEvent(new Event('appinstalled'));
    });

    expect(
      screen.queryByRole('region', { name: /Install app banner/i })
    ).not.toBeInTheDocument();
  });

  it('shows bilingual iOS Safari tip when on iOS Safari and not standalone', () => {
    Object.defineProperty(window.navigator, 'userAgent', {
      writable: true,
      configurable: true,
      value:
        'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
    });

    const { rerender } = render(<PwaInstallBanner language="en" />);
    expect(
      screen.getByText(/Share ➔ Add to Home Screen/i)
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: /^Install$/i })
    ).not.toBeInTheDocument();

    rerender(<PwaInstallBanner language="mm" />);
    expect(
      screen.getByText(/Share ခလုတ်ကို နှိပ်ပြီး Add to Home Screen ကို ရွေးပါ/i)
    ).toBeInTheDocument();
  });
});
