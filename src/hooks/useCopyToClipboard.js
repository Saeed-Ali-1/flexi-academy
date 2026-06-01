import { useCallback } from 'react';
import { useUIStore } from '../lib/uiStore.js';

export function useCopyToClipboard() {
  const pushToast = useUIStore((s) => s.pushToast);
  return useCallback(
    async (value, { label = 'Copied to clipboard' } = {}) => {
      try {
        await navigator.clipboard.writeText(String(value));
        pushToast({ title: label, body: String(value), tone: 'success' });
        return true;
      } catch {
        pushToast({
          title: "Couldn't copy",
          body: 'Your browser blocked clipboard access.',
          tone: 'error',
        });
        return false;
      }
    },
    [pushToast]
  );
}
