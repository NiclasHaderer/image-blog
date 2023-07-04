import { createContext, FC, ReactNode, useContext } from 'react';
import { NodeProps } from '@image-blog/shared';
import { ViewNode } from '../nodes/view-node';

const _NodeViewProvider = createContext({
  nodes: [],
} as {
  nodes: ViewNode<NodeProps>[];
});

export const useNodeViewHandlers = () => {
  return useContext(_NodeViewProvider).nodes;
};

export const useNodeViewHandler = (node: NodeProps) => {
  return useNodeViewHandlers().find((p) => p.canHandle(node));
};

export const NodeViewProvider: FC<{ children: ReactNode; editorNodes: ViewNode<any>[] }> = ({
  children,
  editorNodes,
}) => {
  return (
    // eslint-disable-next-line react/jsx-pascal-case
    <_NodeViewProvider.Provider
      value={{
        nodes: editorNodes,
      }}
    >
      {children}
    </_NodeViewProvider.Provider>
  );
};
