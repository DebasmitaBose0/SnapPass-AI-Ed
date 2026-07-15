import { describe, it, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useKeyboardShortcuts, getShortcutLabel } from '../../hooks/useKeyboardShortcuts';

describe('getShortcutLabel', () => {
  it('returns label for known action', () => {
    const result = getShortcutLabel('navigate:home');
    expect(result).not.toBeNull();
    expect(result.keys).toBe('g h');
  });

  it('returns null for unknown action', () => {
    expect(getShortcutLabel('unknown:action')).toBeNull();
  });
});

describe('useKeyboardShortcuts', () => {
  it('registers and triggers handler on matching sequence', () => {
    const handler = vi.fn();
    renderHook(() => useKeyboardShortcuts({ 'navigate:home': handler }));

    const event = new KeyboardEvent('keydown', { key: 'h' });
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'g' }));
    window.dispatchEvent(event);

    expect(handler).toHaveBeenCalled();
  });

  it('ignores shortcuts in input fields', () => {
    const handler = vi.fn();
    renderHook(() => useKeyboardShortcuts({ 'navigate:home': handler }));

    const input = document.createElement('input');
    const event = new KeyboardEvent('keydown', { key: 'g', target: input, bubbles: true });
    window.dispatchEvent(event);
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'h', target: input, bubbles: true }));

    expect(handler).not.toHaveBeenCalled();
  });
});
