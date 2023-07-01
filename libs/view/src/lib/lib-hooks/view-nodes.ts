import { ViewNode } from '../nodes/view-node';
import { createContext, useContext } from 'react';
import { NodeProps } from '@image-blog/common';

export const useNodeViewHandlers = (): ViewNode<any>[] => {
  const context = useContext(NodeViewHandlerContext);
  return context.nodes;
};

const NodeViewHandlerContext = createContext({
  nodes: [],
} as {
  nodes: ViewNode<NodeProps>[];
});

export const NodeViewHandlersProvider = NodeViewHandlerContext.Provider;
