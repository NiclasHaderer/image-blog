import React, { FC } from 'react';
import { NodeProps } from '@image-blog/common';
import { useNodeViewHandlers } from '../lib-hooks/view-nodes';

export const ViewEditorChild: FC<{ node: NodeProps }> = ({ node }) => {
  const nodes = useNodeViewHandlers();
  const Node = nodes.find((n) => n.canHandle(node));
  if (!Node) {
    return (
      <div>
        Unknown component {node.id}
        <code>{JSON.stringify(node)}</code>
      </div>
    );
  }

  return <Node.Render {...node} />;
};
