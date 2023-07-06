import { NodeProvider } from './nodes/nodes';
import { FC, ReactNode } from 'react';
import { EditorChild, RootEditorContextProvider } from './editor-building-blocks';
import { AbstractNode } from './nodes/abstract-node';
import { RootNodeProps } from '@image-blog/shared';
import { useEditorStateHandler } from './state-holder';

export const Editor: FC<{ editorNodes: AbstractNode<any>[]; state?: RootNodeProps; children: ReactNode }> = ({
  editorNodes,
  state,
  children,
}) => {
  const descriptions = editorNodes.map((n) => n.nodeDescription);
  const editorState = useEditorStateHandler(descriptions, state);

  return (
    <RootEditorContextProvider editorState={editorState}>
      <NodeProvider editorNodes={editorNodes}>
        <>
          <EditorChild index={[]}>{editorState.editorState}</EditorChild>
          {children}
        </>
      </NodeProvider>
    </RootEditorContextProvider>
  );
};
