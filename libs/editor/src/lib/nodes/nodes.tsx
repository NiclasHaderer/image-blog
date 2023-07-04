import { createContext, FC, ReactElement, useContext } from 'react';
import { AbstractNode } from './abstract-node';
import { NodeProps } from '@image-blog/common';

const NodeHandlerContext = createContext({
  nodes: [],
} as {
  nodes: AbstractNode<NodeProps>[];
});

export const useNodeHandlers = () => {
  return useContext(NodeHandlerContext).nodes;
};

export const useQueryNodeHandlers = (query: string) => {
  return useNodeHandlers()
    .map((p) => [p, p.distance(query)] as [AbstractNode<NodeProps>, number])
    .filter(([, distance]) => distance > -Infinity)
    .sort(([, a], [, b]) => a - b)
    .map(([p]) => p);
};

export const NodeProvider: FC<{ children: ReactElement; editorNodes: AbstractNode<any>[] }> = ({
  children,
  editorNodes,
}) => {
  return (
    <NodeHandlerContext.Provider
      value={{
        nodes: editorNodes,
      }}
    >
      {children}
    </NodeHandlerContext.Provider>
  );
};
