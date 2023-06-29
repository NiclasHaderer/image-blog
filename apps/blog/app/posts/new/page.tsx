'use client';

import { Editor, EditorHistory } from '@image-blog/editor';

export default function Page() {
  return (
    <Editor>
      <EditorHistory maxHistory={20} />
    </Editor>
  );
}
