import { FC, ReactNode } from 'react';
import { RootNodeProps } from '@image-blog/shared';
import { useOnEditorUpdate } from '../state-holder';

export const EditorEvents: FC<{ onChange?: (state: RootNodeProps) => void; children?: ReactNode }> = ({
  onChange,
  children,
}) => {
  useOnEditorUpdate((oldState, newState, action) => {
    if (action.type === 'replace-root' && action.payload.skipHistory) return;
    onChange?.(newState);
  });
  return children;
};
