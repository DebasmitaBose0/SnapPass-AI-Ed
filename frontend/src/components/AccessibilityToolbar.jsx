import React from 'react';
import { useThemeCustomizer } from '../context/ThemeCustomizerContext';

export default function AccessibilityToolbar() {
  const { highContrast, setHighContrast, fontSizeScale, setFontSizeScale } = useThemeCustomizer();

  return (
    <div className="p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 flex items-center justify-between gap-4 text-xs">
      <div className="flex items-center gap-2">
        <span className="font-semibold text-gray-700 dark:text-gray-200">Accessibility Controls:</span>
        <button
          onClick={() => setHighContrast(!highContrast)}
          className={`px-2.5 py-1 rounded font-medium border ${
            highContrast
              ? 'bg-black text-yellow-300 border-yellow-400'
              : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
          }`}
        >
          {highContrast ? 'High Contrast ON' : 'High Contrast OFF'}
        </button>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-gray-600 dark:text-gray-400">Text Size:</span>
        <button
          onClick={() => setFontSizeScale(Math.max(0.9, fontSizeScale - 0.1))}
          className="px-2 py-0.5 rounded bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-bold"
        >
          A-
        </button>
        <span className="font-mono text-gray-700 dark:text-gray-300">{Math.round(fontSizeScale * 100)}%</span>
        <button
          onClick={() => setFontSizeScale(Math.min(1.4, fontSizeScale + 0.1))}
          className="px-2 py-0.5 rounded bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-bold"
        >
          A+
        </button>
      </div>
    </div>
  );
}
