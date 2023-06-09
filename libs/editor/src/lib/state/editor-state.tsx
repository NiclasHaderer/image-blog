import {
  createContext,
  FC,
  forwardRef,
  HTMLProps,
  ReactNode,
  useContext,
  useEffect,
  useReducer,
  useState,
} from 'react';
import { EditorAction, EditorActions, editorReducer } from './update/reducer';
import { useNodeHandlers } from '../nodes/nodes';
import { Slot } from '../common/slot';
import { getNodeProps, getNodesInRange } from './update/utils';
import { ControlNode } from '../nodes/control-node';
import { NodeCapabilities } from '../nodes/abstract-node';
import { logger } from '../logger';

const log = logger('editor-state');

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

const RootEditorContext = createContext({
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
      immutableChildren: false,
      canHaveChildren: true,
      maxChildren: Infinity,
      minChildren: 1,
      canBeInnerFocused: false,
    },
  } satisfies RootNodeProps);

  return (
    <RootEditorContext.Provider
      value={{
        data: editorState as RootNodeProps,
        update: (newData) => setEditorState(newData),
      }}
    >
      {children}
    </RootEditorContext.Provider>
  );
};

export const RootEditorOutlet: FC = forwardRef<HTMLDivElement, HTMLProps<HTMLDivElement>>((props, ref) => {
  const rootContext = useContext(RootEditorContext);
  const editorState = rootContext.data;

  const [history, setHistory] = useState<{
    index: number;
    history: RootNodeProps[];
  }>({
    index: 0,
    history: [editorState],
  });

  useEffect(() => {
    setHistory((history) => {
      const newHistory = { ...history };
      const historyLength = newHistory.history.length;
      if (historyLength > 100) {
        newHistory.history = newHistory.history.slice(historyLength - 100);
      }
      newHistory.history = [...newHistory.history, editorState];
      newHistory.index = newHistory.history.length - 1;
      return newHistory;
    });
  }, [editorState]);

  return (
    <div
      ref={ref}
      {...props}
      onKeyDown={(e) => {
        // TODO history currently only toggles between the last two states
        if (e.key === 'z' && e.ctrlKey) {
          rootContext.update({
            type: 'replace-root',
            payload: history.history[history.index - 1],
            origin: [],
          });
        }
        if (e.key === 'y' && e.ctrlKey) {
          rootContext.update({
            type: 'replace-root',
            payload: history.history[history.index + 1],
            origin: [],
          });
        }
      }}
    >
      <EditorChildren>{editorState}</EditorChildren>
    </div>
  );
});

const UnsetChildContext = Symbol('unset-child-context');
const ChildContext = createContext({
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
  const childContext = useContext(ChildContext);
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
    <ChildContext.Provider
      value={{
        index,
      }}
    >
      <Slot>
        <NodeRenderer node={children} />
      </Slot>
    </ChildContext.Provider>
  );
};

export const useUpdateEditor = () => {
  const rootContext = useContext(RootEditorContext);
  const { index } = useContext(ChildContext);

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
  const rootContext = useContext(RootEditorContext).data;
  const { index } = useContext(ChildContext);
  const node = getNodeProps(rootContext, index);
  if (!node) {
    log.error('No node found for index', index, rootContext);
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
  const rootContext = useContext(RootEditorContext).data;
  const { index } = useContext(ChildContext);
  const isFocused = rootContext.focusedNode?.join('.') === index.join('.');
  return {
    isFocused,
    force: rootContext.forceFocus,
  };
};

export const useIsNodeOuterFocused = () => {
  const rootContext = useContext(RootEditorContext).data;
  const { index } = useContext(ChildContext);

  const outerFocusNode = rootContext.outerFocusedNode;
  const range = rootContext.outerFocusedRange ?? 0;
  if (!outerFocusNode) return false;
  const focusedNodes = getNodesInRange(rootContext, outerFocusNode, range);
  return focusedNodes.some((node) => node.join('.') === index.join('.'));
};

export const useNodeIndex = () => {
  const { index } = useContext(ChildContext);
  return index;
};
