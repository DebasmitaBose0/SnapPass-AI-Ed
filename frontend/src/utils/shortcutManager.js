export function setupShortcutListeners(handlers = {}) {
  const listener = (event) => {
    if (event.ctrlKey && event.key === 'u') {
      event.preventDefault();
      if (handlers.onUpload) handlers.onUpload();
    }
    if (event.ctrlKey && event.key === 'p') {
      event.preventDefault();
      if (handlers.onPrint) handlers.onPrint();
    }
  };

  window.addEventListener('keydown', listener);
  return () => window.removeEventListener('keydown', listener);
}
