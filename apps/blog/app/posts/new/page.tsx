'use client';

import {
  ColumnNode,
  ColumnNodeOutlet,
  ControlNode,
  DividerNode,
  EditorHistory,
  ImageNode,
  SideBySideEditor,
} from '@image-blog/editor';
import { ColumnOutletViewNode, ColumnViewNode, DividerViewNode, ImageViewNode } from '@image-blog/view';

const EDITOR_NODES = [new ControlNode(), new ImageNode(), new DividerNode(), new ColumnNode(), new ColumnNodeOutlet()];

const VIEW_NODES = [ImageViewNode, DividerViewNode, ColumnViewNode, ColumnOutletViewNode];

export default function Page() {
  return (
    <SideBySideEditor editorNodes={EDITOR_NODES} viewNodes={VIEW_NODES}>
      <EditorHistory maxHistory={20} />
    </SideBySideEditor>
  );
}
