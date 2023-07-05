import { FC, ReactNode } from 'react';
import { NodeViewProvider } from './context/node-view-provider';
import { ViewNode } from './nodes';
import { RootNodeProps } from '@image-blog/shared';
import { ViewEditorChild } from './nodes/view-editor-child';

export const EditorViewer: FC<{
  editorNodes: ViewNode<any>[];
  rootNode: RootNodeProps;
  skipUnknownNodes?: boolean;
  children: ReactNode;
}> = ({ children, editorNodes, rootNode, skipUnknownNodes = true }) => {
  return (
    <div>
      <NodeViewProvider editorNodes={editorNodes}>
        <ViewEditorChild node={rootNode} skipUnknownNodes={skipUnknownNodes} />
        {children}
      </NodeViewProvider>
    </div>
  );
};
