import { NodeProvider } from './nodes/nodes';
import { RootEditorContextProvider, RootEditorOutlet } from './state/editor-state';
import { forwardRef, HTMLProps } from 'react';

export const Editor = forwardRef<HTMLDivElement, HTMLProps<HTMLDivElement>>((props, ref) => {
  return (
    <NodeProvider>
      <RootEditorContextProvider>
        <RootEditorOutlet ref={ref} {...props} />
      </RootEditorContextProvider>
    </NodeProvider>
  );
});
