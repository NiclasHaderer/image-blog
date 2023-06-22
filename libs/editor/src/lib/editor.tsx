import { NodeProvider } from './nodes/nodes';
import { forwardRef, HTMLProps } from 'react';
import { RootEditorContextProvider, RootEditorOutlet } from './editor-building-blocks';

export const Editor = forwardRef<HTMLDivElement, HTMLProps<HTMLDivElement>>((props, ref) => {
  return (
    <NodeProvider>
      <RootEditorContextProvider>
        <RootEditorOutlet ref={ref} {...props} />
      </RootEditorContextProvider>
    </NodeProvider>
  );
});
