import { createContext, FC, ReactElement, useContext } from 'react';
import { EditorNode } from './editor-node';
import { ControlNode } from './control-node';
import { ImageNode } from './image-node';
import { DividerNode } from './divider-node';
import { NodeProps } from '../state/editor-state';
import { AbstractNode, ColumnNodeOutlet } from './abstract-node';

const NodeContext = createContext({
  nodes: [],
} as {
  nodes: EditorNode<NodeProps>[];
});

export const useNodes = () => {
  return useContext(NodeContext).nodes;
};

export const useNodeQuery = (query: string) => {
  return useNodes()
    .map((p) => [p, p.distance(query)] as [EditorNode<NodeProps>, number])
    .filter(([, distance]) => distance > -Infinity)
    .sort(([, a], [, b]) => a - b)
    .map(([p]) => p);
};

export const NodeProvider: FC<{ children: ReactElement }> = ({ children }) => {
  return (
    <NodeContext.Provider
      value={{
        nodes: [new ControlNode(), new ImageNode(), new DividerNode(), new AbstractNode(), new ColumnNodeOutlet()],
      }}
    >
      {children}
    </NodeContext.Provider>
  );
};
