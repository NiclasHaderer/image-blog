import { NodeProvider } from './nodes/nodes';
import { FC, forwardRef, HTMLProps, ReactNode } from 'react';
import { RootEditorContextProvider, RootEditorOutlet } from './editor-building-blocks';
import { AbstractNode } from './nodes/abstract-node';
import { RootNodeProps } from '@image-blog/shared';
import { useOnEditorUpdate } from './state-holder';

export const Editor = forwardRef<HTMLDivElement, HTMLProps<HTMLDivElement> & { editorNodes: AbstractNode<any>[] }>(
  ({ children, editorNodes, ...props }, ref) => {
    return (
      <NodeProvider editorNodes={editorNodes}>
        <RootEditorContextProvider>
          <RootEditorOutlet ref={ref} {...props} />
          {children}
        </RootEditorContextProvider>
      </NodeProvider>
    );
  }
);

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
