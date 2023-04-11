import { NodeProvider } from './nodes/nodes';
import { RootEditorContextProvider, RootEditorOutlet } from './state/editor-state';

export const Editor = () => {
  return (
    <NodeProvider>
      <RootEditorContextProvider>
        <RootEditorOutlet />
      </RootEditorContextProvider>
    </NodeProvider>
  );
};
