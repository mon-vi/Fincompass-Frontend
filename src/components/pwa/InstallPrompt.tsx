import { useState, useEffect } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const DISMISSED_KEY = 'fc:pwa-install-dismissed';

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem(DISMISSED_KEY)) return;

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setVisible(true);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const dismiss = () => {
    sessionStorage.setItem(DISMISSED_KEY, '1');
    setVisible(false);
  };

  const install = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') setVisible(false);
    setDeferredPrompt(null);
  };

  if (!visible) return null;

  return (
    <div
      role="banner"
      className="fixed bottom-[calc(env(safe-area-inset-bottom,0px)+3.75rem+0.75rem)] left-4 right-4 z-50 flex items-center gap-3 rounded-2xl border border-[#12355b]/20 bg-white px-4 py-3 shadow-lg shadow-slate-900/10 lg:bottom-6 lg:left-auto lg:right-6 lg:max-w-xs"
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#12355b] text-xs font-black text-white">
        FC
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-bold text-slate-900">Install FinCompass</p>
        <p className="text-xs text-slate-500">Add to your home screen for faster access.</p>
      </div>
      <div className="flex shrink-0 gap-2">
        <button
          onClick={install}
          className="rounded-xl bg-[#12355b] px-3 py-1.5 text-xs font-bold text-white"
        >
          Install
        </button>
        <button
          onClick={dismiss}
          aria-label="Dismiss install prompt"
          className="rounded-xl px-2 py-1.5 text-xs font-semibold text-slate-500 hover:bg-slate-100"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
