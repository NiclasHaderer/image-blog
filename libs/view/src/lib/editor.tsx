import { forwardRef, HTMLProps } from 'react';
import { NodeViewProvider } from './context/node-view-provider';
import { ViewEditorChild } from './nodes/view-editor-child';
import { ViewNode } from './nodes/view-node';
import { RootNodeProps } from '@image-blog/shared';

export const EditorViewer = forwardRef<
  HTMLDivElement,
  HTMLProps<HTMLDivElement> & { editorNodes: ViewNode<any>[]; rootNode: RootNodeProps; skipUnknownNodes?: boolean }
>(({ children, editorNodes, rootNode, skipUnknownNodes = true, ...props }, ref) => {
  return (
    <div {...props}>
      <NodeViewProvider editorNodes={editorNodes}>
        {rootNode.children?.map((child, index) => (
          <ViewEditorChild node={child} key={index} skipUnknownNodes={skipUnknownNodes} />
        ))}
      </NodeViewProvider>
    </div>
  );
});
