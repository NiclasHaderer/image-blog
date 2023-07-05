import { useEffect, useMemo, KeyboardEvent as ReactKeyboardEvent } from 'react';

export const compileShortcut = (shortcut: string): ((e: KeyboardEvent) => boolean) => {
  const parts = shortcut.split('+');
  let key = parts[parts.length - 1];
  if (key === 'Space') key = ' ';

  const hasAlt = parts.includes('Alt') || parts.includes('alt');
  const hasShift = parts.includes('Shift') || parts.includes('shift');
  const hasMod = parts.includes('Mod') || parts.includes('mod');
  const hasCtrl = parts.includes('Ctrl') || parts.includes('ctrl');
  const hasCmd = parts.includes('Cmd') || parts.includes('cmd');

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
  element: HTMLElement | Window | null,
  callback: (e: KeyboardEvent) => void | Promise<void>,
  filter?: (e: KeyboardEvent) => boolean
) => {
  const compiledShortcut = useMemo(() => compileShortcut(shortcut), [shortcut]);

  useEffect(() => {
    if (!element) return;
    const handler = (e: KeyboardEvent) => {
      if (compiledShortcut(e)) {
        if (filter && !filter(e)) return;
        void callback(e);
      }
    };
    window.addEventListener('keydown', handler);
    element.addEventListener('keydown', handler as any);
    return () => element.removeEventListener('keydown', handler as any);
  }, [callback, element, compiledShortcut, filter]);
};
