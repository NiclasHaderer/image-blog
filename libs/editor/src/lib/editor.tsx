import { NodeProvider } from './nodes/nodes';
import { forwardRef, HTMLProps } from 'react';
import { RootEditorContextProvider, RootEditorOutlet } from './editor-building-blocks';

export const Editor = forwardRef<HTMLDivElement, HTMLProps<HTMLDivElement>>(({ children, ...props }, ref) => {
  return (
    <NodeProvider>
      <RootEditorContextProvider>
        <RootEditorOutlet ref={ref} {...props} />
        {children}
      </RootEditorContextProvider>
    </NodeProvider>
  );
});
