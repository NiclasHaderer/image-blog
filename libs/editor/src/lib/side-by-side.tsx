import { FC, ReactNode, useState } from 'react';
import { AbstractNode } from './nodes/abstract-node';
import { EditorViewer, ViewNode } from '@image-blog/view';
import { Editor, EditorEvents } from './editor';
import { RootNodeProps } from '@image-blog/shared';

export const SideBySideEditor: FC<{
  editorNodes: AbstractNode<any>[];
  viewNodes: ViewNode<any>[];
  children: ReactNode;
}> = ({ children, editorNodes, viewNodes }) => {
  const [viewOnlyRootNode, setViewOnlyRootNode] = useState<RootNodeProps>();
  return (
    <div className="flex">
      <div className="inline-block w-1/2">
        <Editor editorNodes={editorNodes}>
          {children}
          <EditorEvents onChange={setViewOnlyRootNode}></EditorEvents>
        </Editor>
      </div>
      <div className="inline-block w-1/2 overflow-auto">
        {viewOnlyRootNode && <EditorViewer editorNodes={viewNodes} rootNode={viewOnlyRootNode} />}
      </div>
    </div>
  );
};
