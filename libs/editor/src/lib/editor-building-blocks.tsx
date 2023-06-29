import React, { FC, forwardRef, HTMLProps, ReactNode, useContext } from 'react';
import { ChildContext, NodeProps, RootEditorContext, UnsetChildContext, useEditorState } from './state/editor-state';
import { useNodeHandlers } from './nodes/nodes';
import { Slot } from './common/slot';
import { useEditorHistory } from './hooks/history';

export const RootEditorOutlet: FC = forwardRef<HTMLDivElement, HTMLProps<HTMLDivElement>>((props, ref) => {
  return (
    <div ref={ref} {...props}>
      <EditorChildren>{useContext(RootEditorContext).data}</EditorChildren>
    </div>
  );
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

export const RootEditorContextProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const { editorState, editorUpdateCbs, update } = useEditorState();

  return (
    <RootEditorContext.Provider
      value={{
        data: editorState,
        update,
        editorUpdateCbs,
      }}
    >
      {children}
    </RootEditorContext.Provider>
  );
};

export const EditorHistory: FC<{ children?: ReactNode; maxHistory?: number }> = ({ children, maxHistory = 20 }) => {
  useEditorHistory(maxHistory);
  return <>{children}</>;
};
