import { PanelProvider } from './state/panels';
import { RootEditorContextProvider, RootEditorOutlet } from './state/editor-state';

export const Editor = () => {
  return (
    <PanelProvider>
      <RootEditorContextProvider>
        <RootEditorOutlet mode={'edit'} />
      </RootEditorContextProvider>
    </PanelProvider>
  );
};
