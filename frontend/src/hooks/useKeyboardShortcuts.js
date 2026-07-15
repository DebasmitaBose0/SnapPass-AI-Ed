import { useEffect } from 'react';

const SHORTCUTS = {
  'g h': { action: 'navigate:home', label: 'Go to Home' },
  'g u': { action: 'navigate:upload', label: 'Go to Upload' },
  'g e': { action: 'navigate:editor', label: 'Go to Editor' },
  'g p': { action: 'navigate:print', label: 'Go to Print Preview' },
  'g s': { action: 'navigate:settings', label: 'Go to Settings' },
  '?': { action: 'help:toggle', label: 'Toggle keyboard shortcuts help' },
};

export function useKeyboardShortcuts(handlers = {}) {
  useEffect(() => {
    let buffer = '';

    const onKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable) return;

      const key = e.key === ' ' ? 'Space' : e.key;
      buffer += key.toLowerCase();

      const matched = SHORTCUTS[buffer];
      if (matched) {
        e.preventDefault();
        buffer = '';
        const handler = handlers[matched.action];
        if (handler) handler();
        return;
      }

      const partial = Object.keys(SHORTCUTS).some((seq) => seq.startsWith(buffer));
      if (!partial) buffer = '';
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [handlers]);
}

export function getShortcutLabel(action) {
  const entry = Object.entries(SHORTCUTS).find(([, v]) => v.action === action);
  return entry ? { keys: entry[0], label: entry[1].label } : null;
}
