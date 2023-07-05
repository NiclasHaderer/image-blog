import { FC, ReactNode } from 'react';
import { useOnEditorUpdate } from '../state-holder';
import { useShortcut } from '../keyboard-event';

export const EditorGlobalState: FC<{
  children?: ReactNode;
  saveKey: string;
  enableCopyHotkey?: boolean;
  copyHotkey?: string;
}> = ({ children, saveKey, enableCopyHotkey = true, copyHotkey = 'ctrl+alt+c' }) => {
  useOnEditorUpdate((oldState, newState, action) => {
    if (typeof window !== 'undefined') {
      (window as any)[saveKey] = newState;
    }
  });

  useShortcut(copyHotkey, typeof window === undefined ? null : (window as Window), async () => {
    if (!enableCopyHotkey) return;

    const state = (window as any)[saveKey];
    if (state) {
      await navigator.clipboard.writeText(JSON.stringify(state));
    }
  });

  return <>{children}</>;
};
