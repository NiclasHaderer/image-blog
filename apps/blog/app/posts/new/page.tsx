'use client';

import {
  ColumnNode,
  ColumnNodeOutlet,
  ControlNode,
  DividerNode,
  EditorGlobalState,
  EditorHistory,
  ImageNode,
  SideBySideEditor,
} from '@image-blog/editor';
import { ColumnOutletViewNode, ColumnViewNode, DividerViewNode, ImageViewNode } from '@image-blog/view';

const EDITOR_NODES = [new ControlNode(), new ImageNode(), new DividerNode(), new ColumnNode(), new ColumnNodeOutlet()];

const VIEW_NODES = [new ImageViewNode(), new DividerViewNode(), new ColumnViewNode(), new ColumnOutletViewNode()];

export default function Page() {
  return (
    <SideBySideEditor editorNodes={EDITOR_NODES} viewNodes={VIEW_NODES}>
      <EditorGlobalState saveKey="editor">
        <EditorHistory maxHistory={20} />
      </EditorGlobalState>
    </SideBySideEditor>
  );
}
