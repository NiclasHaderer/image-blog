import { FC, ReactNode } from 'react';
import { useOnEditorUpdate, useUpdateEditor } from '../state-holder';
import { useShortcut } from '../keyboard-event';
import { useOnMount } from '../hooks/livecycle';
import { unstable_batchedUpdates } from 'react-dom';
import { RootNodeProps } from '@image-blog/shared';

export const EditorGlobalState: FC<{
  children?: ReactNode;
  saveKey: string;
  enableCopyHotkey?: boolean;
  copyHotkey?: string;
}> = ({ children, saveKey, enableCopyHotkey = true, copyHotkey = 'ctrl+alt+c' }) => {
  const dispatch = useUpdateEditor();
  useOnEditorUpdate((oldState, newState) => {
    if (typeof window !== 'undefined') {
      (window as any)[saveKey] = newState;
    }
  });

  useShortcut(copyHotkey, typeof window === 'undefined' ? null : (window as Window), async () => {
    if (!enableCopyHotkey) return;

    const state = (window as any)[saveKey];
    if (state) {
      await window.navigator.clipboard.writeText(JSON.stringify(state));
    }
  });

  useOnMount(() => {
    if (typeof window === 'undefined') return;

    (window as any)[`${saveKey}LoadState`] = (state: RootNodeProps) => {
      unstable_batchedUpdates(() => {
        dispatch('replace-root', { with: state, skipHistory: false });
      });
    };
  });

  return <>{children}</>;
};
