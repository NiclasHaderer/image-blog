import { createContext, FC, ReactNode, useContext, useReducer } from 'react';
import { EditorAction, EditorActions, editorReducer } from './update/reducer';
import { useNodeHandlers } from '../nodes/nodes';
import { Slot } from '../common/slot';
import { getNode, getNodesInRange } from './update/utils';
import { ControlNode } from '../nodes/control-node';
import { NodeCapabilities } from '../nodes/editor-node';

export interface NodeProps<T = any> {
  id: string;
  children?: NodeProps[];
  data: T;
  capabilities: NodeCapabilities;
}

export interface RootNodeProps extends NodeProps {
  focusedNode: number[] | null;
  forceFocus: boolean;
  outerFocusedNode: number[] | null;
  outerFocusedRange: number | null;
}

const _RootEditorContext = createContext({
  update: (_: EditorActions): void => {
    throw new Error('Do not use the update function of the RootEditorContext outside of the RootEditorContextProvider');
  },
  data: {} as RootNodeProps,
});

export const RootEditorContextProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [editorState, setEditorState] = useReducer(editorReducer, {
    children: [ControlNode.empty()],
    id: 'root',
    data: {},
    focusedNode: [0],
    outerFocusedNode: null,
    outerFocusedRange: null,
    forceFocus: false,
    capabilities: {
      canBeDeleted: false,
      structural: true,
      canBeInnerFocused: false,
    },
  } satisfies RootNodeProps);

  return (
    <_RootEditorContext.Provider
      value={{
        data: editorState as RootNodeProps,
        update: (newData) => setEditorState(newData),
      }}
    >
      {children}
    </_RootEditorContext.Provider>
  );
};

export const RootEditorOutlet: FC = () => {
  const rootContext = useContext(_RootEditorContext);
  return <EditorChildren>{rootContext.data}</EditorChildren>;
};

const UnsetChildContext = Symbol('unset-child-context');
const _ChildContext = createContext({
  index: UnsetChildContext as unknown as number[],
});

const NodeRenderer: FC<{ node: NodeProps }> = ({ node }) => {
  const nodes = useNodeHandlers();
  const Node = nodes.find((n) => n.canHandle(node));
  if (!Node) {
    return <>Unknown component {node.id}</>;
  }

  return <Node.Render {...node} />;
};

export const EditorChildren: FC<{ children: NodeProps }> = ({ children }) => {
  const childContext = useContext(_ChildContext);
  const contextToUse = (childContext.index as unknown) === UnsetChildContext ? { index: [] } : childContext;

  return (
    <>
      {children.children?.map((child, index) => {
        return (
          <EditorChild key={index} index={[...contextToUse.index, index]}>
            {child}
          </EditorChild>
        );
      })}
    </>
  );
};

export const EditorChild: FC<{ index: number[]; children: NodeProps }> = ({ index, children }) => {
  return (
    <_ChildContext.Provider
      value={{
        index,
      }}
    >
      <Slot>
        <NodeRenderer node={children} />
      </Slot>
    </_ChildContext.Provider>
  );
};

export const useUpdateEditor = () => {
  const rootContext = useContext(_RootEditorContext);
  const { index } = useContext(_ChildContext);

  return <T extends EditorActions['type'], V extends EditorActions & { type: T }>(
    action: T,
    payload: V extends EditorAction<infer S> ? S : never
  ) => {
    rootContext.update({
      type: action,
      origin: index,
      payload: payload as any,
    });
  };
};

export const useNode = () => {
  const rootContext = useContext(_RootEditorContext).data;
  const { index } = useContext(_ChildContext);
  const node = getNode(rootContext, index);
  if (!node) {
    console.log('No node found for index', index, rootContext);
    throw new Error('No node found for index');
  }

  return node;
};

export const useNodeData = () => {
  const node = useNode();
  return node.data;
};

export const useNodeHandler = () => {
  const nodeProps = useNode();
  const nodes = useNodeHandlers();
  const node = nodes.find((p) => p.canHandle(nodeProps));
  if (!node) {
    throw new Error(`No node for nodeProps with id ${nodeProps.id}`);
  }
  return node;
};

export const useNodeCapabilities = () => {
  const node = useNode();
  return node.capabilities;
};

export const useIsNodeInnerFocused = () => {
  const rootContext = useContext(_RootEditorContext).data;
  const { index } = useContext(_ChildContext);
  const isFocused = rootContext.focusedNode?.join('.') === index.join('.');
  return {
    isFocused,
    force: rootContext.forceFocus,
  };
};

export const useIsNodeOuterFocused = () => {
  const rootContext = useContext(_RootEditorContext).data;
  const { index } = useContext(_ChildContext);

  const outerFocusNode = rootContext.outerFocusedNode;
  const range = rootContext.outerFocusedRange ?? 0;
  if (!outerFocusNode) return false;
  const focusedNodes = getNodesInRange(rootContext, outerFocusNode, range);
  return focusedNodes.some((node) => node.join('.') === index.join('.'));
};

export const useNodeIndex = () => {
  const { index } = useContext(_ChildContext);
  return index;
};
