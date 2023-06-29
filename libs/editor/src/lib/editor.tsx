import { NodeProvider } from './nodes/nodes';
import { forwardRef, HTMLProps } from 'react';
import { RootEditorContextProvider, RootEditorOutlet } from './editor-building-blocks';
import { AbstractNode } from './nodes/abstract-node';

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
