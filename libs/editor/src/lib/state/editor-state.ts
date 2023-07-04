import React, { createContext, useContext, useEffect, useReducer, useRef } from 'react';
import { EditorAction, EditorActions, editorReducer } from './update/reducer';
import { useNodeHandlers } from '../nodes/nodes';
import { getNodeProps, getNodesInRange } from './update/utils';
import { logger } from '../logger';
import { EMPTY_CONTROL_NODE } from '../nodes/empty-control-node';
import { NodeCapabilities } from '@image-blog/common';

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

export const RootEditorContext = createContext({
  update: (_: EditorActions): void => {
    throw new Error('Do not use the update function of the RootEditorContext outside of the RootEditorContextProvider');
  },
  editorUpdateCbs: { current: [] } as React.MutableRefObject<
    ((oldState: RootNodeProps, newState: RootNodeProps, action: EditorActions) => void)[]
  >,
  data: {} as RootNodeProps,
});

export const useEditorState = () => {
  const [editorState, setEditorState] = useReducer(editorReducer, {
    children: [EMPTY_CONTROL_NODE],
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
  const oldValueAndAction = useRef<{ oldData: RootNodeProps; action: EditorActions }>({
    oldData: editorState,
    action: { type: 'init', payload: undefined, origin: [] },
  });

  const editorUpdateCbs = useRef<((oldState: RootNodeProps, newState: RootNodeProps, action: EditorActions) => void)[]>(
    []
  );

  useEffect(() => {
    const { oldData, action } = oldValueAndAction.current ?? {};
    editorUpdateCbs.current.forEach((cb) => cb(oldData, editorState, action));
  }, [editorState]);

  return {
    editorState,
    update: (action: EditorActions) => setEditorState(action),
    editorUpdateCbs,
  };
};

export const UnsetChildContext = Symbol('unset-child-context');
export const ChildContext = createContext({
  index: UnsetChildContext as unknown as number[],
});

export const useUpdateEditor = () => {
  const rootContext = useContext(RootEditorContext);
  const { index } = useContext(ChildContext);

  return <T extends EditorActions['type'], V extends EditorActions & { type: T }>(
    action: T,
    payload: V extends EditorAction<infer S> ? S : never
  ) => {
    rootContext.update({
      type: action,
      origin: index as any,
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

export const useOnEditorUpdate = (
  callback: (oldState: RootNodeProps, newState: RootNodeProps, action: EditorActions) => void
) => {
  const editorContext = useContext(RootEditorContext);
  useEffect(() => {
    editorContext.editorUpdateCbs.current.push(callback);
    return () => {
      editorContext.editorUpdateCbs.current = editorContext.editorUpdateCbs.current.filter((cb) => cb !== callback);
    };
  });
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
