'use client';

import {
  ColumnNode,
  ColumnNodeOutlet,
  ControlNode,
  DividerNode,
  EditorGlobalState,
  EditorHistory,
  ImageNode,
  RootNode,
  SideBySideEditor,
} from '@image-blog/editor';
import { ColumnOutletViewNode, ColumnViewNode, DividerViewNode, ImageViewNode, RootViewNode } from '@image-blog/view';

const EDITOR_NODES = [
  new ControlNode(),
  new ImageNode(),
  new DividerNode(),
  new ColumnNode(),
  new ColumnNodeOutlet(),
  new RootNode(),
];

const VIEW_NODES = [
  new ImageViewNode(),
  new DividerViewNode(),
  new ColumnViewNode(),
  new ColumnOutletViewNode(),
  new RootViewNode(),
];

export default function Page() {
  return (
    <SideBySideEditor editorNodes={EDITOR_NODES} viewNodes={VIEW_NODES}>
      <EditorGlobalState saveKey="editor">
        <EditorHistory maxHistory={20} />
      </EditorGlobalState>
    </SideBySideEditor>
  );
}
