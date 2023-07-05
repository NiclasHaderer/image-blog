import { NodeProvider } from './nodes/nodes';
import { FC, ReactNode } from 'react';
import { EditorChild, RootEditorContextProvider } from './editor-building-blocks';
import { AbstractNode } from './nodes/abstract-node';
import { RootNodeProps } from '@image-blog/shared';
import { useEditorState } from './state-holder';

export const Editor: FC<{ editorNodes: AbstractNode<any>[]; state?: RootNodeProps; children: ReactNode }> = ({
  editorNodes,
  state,
}) => {
  const descriptions = editorNodes.map((n) => n.nodeDescription);
  const editorState = useEditorState(descriptions, state);

  return (
    <NodeProvider editorNodes={editorNodes}>
      <RootEditorContextProvider editorState={editorState}>
        <EditorChild index={[]}>{editorState.editorState}</EditorChild>
      </RootEditorContextProvider>
    </NodeProvider>
  );
};
