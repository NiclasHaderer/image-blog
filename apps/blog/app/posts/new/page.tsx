'use client';

import {
  ColumnNode,
  ColumnNodeOutlet,
  ControlNode,
  DividerNode,
  Editor,
  EditorGlobalState,
  EditorHistory,
  ImageNode,
  RootNode,
  TestGenerator,
} from '@image-blog/editor';

const EDITOR_NODES = [
  new ControlNode(),
  new ImageNode(),
  new DividerNode(),
  new ColumnNode(),
  new ColumnNodeOutlet(),
  new RootNode(),
];

export default function Page() {
  return (
    <Editor editorNodes={EDITOR_NODES}>
      <TestGenerator>
        <EditorGlobalState saveKey="editor">
          <EditorHistory maxHistory={20} />
        </EditorGlobalState>
      </TestGenerator>
    </Editor>
  );
}
