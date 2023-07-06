import React, { FC, ReactNode, useContext } from 'react';
import { ChildContext, RootEditorContext, UnsetChildContext, useEditorStateHandler } from './state-holder';
import { useNodeHandlers } from './nodes/nodes';
import { Slot } from './common/slot';
import { NodeProps } from '@image-blog/shared';

const NodeRenderer: FC<{ node: NodeProps }> = ({ node }) => {
  const nodes = useNodeHandlers();
  const Node = nodes.find((n) => n.canHandle(node));
  if (!Node) {
    return (
      <div>
        Unknown component {node.id}
        <code>{JSON.stringify(node)}</code>
      </div>
    );
  }

  return <Node.Render {...node} />;
};

export const EditorChildren: FC<{ children: NodeProps }> = ({ children }) => {
  const childContext = useContext(ChildContext);
  const contextToUse = (childContext.index as unknown) === UnsetChildContext ? { index: [] } : childContext;

  return (
    // eslint-disable-next-line react/jsx-no-useless-fragment
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

export const RootEditorContextProvider: FC<{
  children: ReactNode;
  editorState: ReturnType<typeof useEditorStateHandler>;
}> = ({ children, editorState: { editorState, editorUpdateCbs, update } }) => {
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
