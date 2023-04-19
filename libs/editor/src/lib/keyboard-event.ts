import { useEffect, useMemo, KeyboardEvent as ReactKeyboardEvent } from 'react';

export const compileShortcut = (shortcut: string): ((e: KeyboardEvent) => boolean) => {
  const parts = shortcut.split('-');
  let key = parts[parts.length - 1];
  if (key === 'Space') key = ' ';

  const hasAlt = parts.includes('Alt');
  const hasShift = parts.includes('Shift');
  const hasMod = parts.includes('Mod');
  const hasCtrl = parts.includes('Ctrl');
  const hasCmd = parts.includes('Cmd');

  return (e: KeyboardEvent) =>
    // Check the keycode against the large and small letter
    e.key === key &&
    e.altKey === hasAlt &&
    e.shiftKey === hasShift &&
    // Check if the meta key was pressed, or the combined mod is allowed
    // Both ctrl and command key
    ((hasMod && ((e.ctrlKey && !e.metaKey) || (!e.ctrlKey && e.metaKey))) ||
      // Only ctrl or command key
      (e.ctrlKey === hasCtrl && e.metaKey === hasCmd && !hasMod));
};

export const isShortcut = (e: KeyboardEvent | ReactKeyboardEvent, shortcut: string) => {
  const compiledShortcut = compileShortcut(shortcut);
  if ('nativeEvent' in e) return compiledShortcut(e.nativeEvent);
  return compiledShortcut(e);
};

export const useShortcut = (
  shortcut: string,
  element: HTMLElement | null,
  callback: (e: KeyboardEvent) => void,
  filter?: (e: KeyboardEvent) => boolean
) => {
  const compiledShortcut = useMemo(() => compileShortcut(shortcut), [shortcut]);

  useEffect(() => {
    if (!element) return;
    const handler = (e: KeyboardEvent) => {
      if (compiledShortcut(e)) {
        if (filter && !filter(e)) return;
        callback(e);
      }
    };

    element.addEventListener('keydown', handler);
    return () => element.removeEventListener('keydown', handler);
  }, [callback, element, compiledShortcut, filter]);
};
