'use client';

import { Editor, EditorHistory } from '@image-blog/editor';
import { DEFAULT_NODES } from '@image-blog/editor';

export default function Page() {
  return (
    <Editor editorNodes={DEFAULT_NODES}>
      <EditorHistory maxHistory={20} />
    </Editor>
  );
}
