import { createContext, useContext } from 'react';
import { EditorPanel, PanelState, TypedStructure } from './panels/editor-panel';
import { ControlPanel } from './panels/control-panel';
import { ImagePanel } from './panels/image-panel';
import { DividerPanel } from './panels/divider-panel';
import { Editor } from './editor';

const Panels = createContext({
  panels: [],
} as {
  panels: EditorPanel<TypedStructure, PanelState>[];
});

export const usePanels = () => {
  return useContext(Panels).panels;
};

export const MainEditor = () => {
  return (
    <Panels.Provider value={{ panels: [ControlPanel, ImagePanel, DividerPanel] }}>
      <Editor />
    </Panels.Provider>
  );
};
