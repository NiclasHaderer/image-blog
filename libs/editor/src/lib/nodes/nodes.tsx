import { createContext, FC, ReactElement, useContext } from 'react';
import { AbstractNode } from './abstract-node';
import { ControlNode } from './control-node';
import { ImageNode } from './image-node';
import { DividerNode } from './divider-node';
import { NodeProps } from '../state/editor-state';
import { ColumnNode, ColumnNodeOutlet } from './column-node';

const NodeHandlerContext = createContext({
  nodes: [],
} as {
  nodes: AbstractNode<NodeProps>[];
});

export const useNodeHandlers = () => {
  return useContext(NodeHandlerContext).nodes;
};

export const useNodeHandlersQuery = (query: string) => {
  return useNodeHandlers()
    .map((p) => [p, p.distance(query)] as [AbstractNode<NodeProps>, number])
    .filter(([, distance]) => distance > -Infinity)
    .sort(([, a], [, b]) => a - b)
    .map(([p]) => p);
};

export const NodeProvider: FC<{ children: ReactElement }> = ({ children }) => {
  return (
    <NodeHandlerContext.Provider
      value={{
        nodes: [new ControlNode(), new ImageNode(), new DividerNode(), new ColumnNode(), new ColumnNodeOutlet()],
      }}
    >
      {children}
    </NodeHandlerContext.Provider>
  );
};
