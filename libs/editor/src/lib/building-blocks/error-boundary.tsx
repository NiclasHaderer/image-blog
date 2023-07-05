import { FC, ReactNode } from 'react';

export const EditorErrorBoundary: FC<{ children: ReactNode }> = ({ children }) => {
  // TODO: create a boundary which displays the error, but also offers to
  //  load the last saved state of the editor, so that the user doesn't lose
  //  their work
  return <>{children}</>;
};
