import { useState, useEffect } from 'react';

export function OfflineBanner() {
  const [offline, setOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const goOffline = () => setOffline(true);
    const goOnline = () => setOffline(false);
    window.addEventListener('offline', goOffline);
    window.addEventListener('online', goOnline);
    return () => {
      window.removeEventListener('offline', goOffline);
      window.removeEventListener('online', goOnline);
    };
  }, []);

  if (!offline) return null;

  return (
    <div
      role="alert"
      aria-live="assertive"
      className="fixed inset-x-0 top-0 z-[60] flex items-center justify-center gap-2 border-b border-amber-200 bg-amber-50 px-4 py-2 text-center text-sm font-semibold text-amber-900 shadow-md"
      style={{ paddingTop: 'max(0.5rem, env(safe-area-inset-top, 0px))' }}
    >
      <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 shrink-0">
        <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
      </svg>
      You're offline. We'll keep the app ready and reconnect when the network returns.
    </div>
  );
}
