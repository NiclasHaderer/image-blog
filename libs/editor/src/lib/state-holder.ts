import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useNodeHandlers } from './nodes/nodes';
import { logger, NodeDescriptions, RootNodeDescription, RootNodeProps } from '@image-blog/shared';
import {
  EditorAction,
  EditorActions,
  editorReducerFactory,
  getNodeCapabilities,
  getNodeProps,
  getPathsInRange,
} from '@image-blog/state';

const log = logger('editor-state');

type UpdateCb = (oldState: RootNodeProps, newState: RootNodeProps, action: EditorActions) => void;

const unsetRootContext = Symbol('unset-root-context');
export const RootEditorContext = createContext({
  update: unsetRootContext as unknown as (_: EditorActions) => void,
  editorUpdateCbs: unsetRootContext as unknown as React.MutableRefObject<UpdateCb[]>,
  data: unsetRootContext as unknown as RootNodeProps,
});

export const useEditorStateHandler = (descriptions: NodeDescriptions, state: RootNodeProps | undefined) => {
  const reducer = useMemo(() => editorReducerFactory(descriptions), [descriptions]);

  const [editorState, setEditorState] = useState(state ?? RootNodeDescription.empty());
  const editorStateRef = useRef(editorState);

  const editorUpdateCbs = useRef<UpdateCb[]>([]);

  return {
    editorState,
    update: (action: EditorActions) => {
      const oldState = editorStateRef.current;
      const newState = reducer(oldState, action);
      editorStateRef.current = newState;
      editorUpdateCbs.current.forEach((cb) => cb(oldState, newState, action));
      setEditorState(newState);
    },
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

export const useOnEditorUpdate = (callback: UpdateCb) => {
  const editorContext = useContext(RootEditorContext);
  useEffect(() => {
    editorContext.editorUpdateCbs.current.push(callback);
    return () => {
      editorContext.editorUpdateCbs.current = editorContext.editorUpdateCbs.current.filter((cb) => cb !== callback);
    };
  });
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
  const descriptions = useNodeHandlers().map((n) => n.nodeDescription);
  return getNodeCapabilities(node, descriptions);
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
  const focusedNodes = getPathsInRange(rootContext, outerFocusNode, range);
  return focusedNodes.some((node) => node.join('.') === index.join('.'));
};

export const useNodeIndex = () => {
  const { index } = useContext(ChildContext);
  return index;
};

export const useEditorState = () => {
  const rootContext = useContext(RootEditorContext);
  return rootContext.data;
};
