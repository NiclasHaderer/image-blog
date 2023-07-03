import React, { FC } from 'react';
import { NodeProps } from '@image-blog/common';
import { useNodeViewHandler } from '../context/node-view-provider';

export const ViewEditorChild: FC<{ node: NodeProps; skipUnknownNodes: boolean }> = ({ node, skipUnknownNodes }) => {
  const Node = useNodeViewHandler(node);
  if (!Node) {
    if (skipUnknownNodes) return null;
    return (
      <div className="border-solid border-b-2 border-text">
        Unknown component {node.id}
        <div className="bg-surface-1 overflow-auto">
          <code>{JSON.stringify(node)}</code>
        </div>
      </div>
    );
  }

  return <Node.Render {...node} />;
};
