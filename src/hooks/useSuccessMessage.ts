import { useEffect, useRef, useState } from 'react';

/**
 * Manages a transient success message that auto-clears after `duration` ms.
 * Usage:
 *   const { message, show } = useSuccessMessage();
 *   // call show('Saved.') in onSuccess; render message && <Alert>{message}</Alert>
 */
export function useSuccessMessage(duration = 3000) {
  const [message, setMessage] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = (msg: string) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setMessage(msg);
    timerRef.current = setTimeout(() => setMessage(null), duration);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return { message, show };
}
