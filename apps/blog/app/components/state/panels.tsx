import { createContext, FC, ReactElement, useContext } from 'react';
import { EditorPanel } from './editor-panel';
import { ControlPanel } from '../panels/control-panel';
import { ImagePanel } from '../panels/image-panel';
import { DividerPanel } from '../panels/divider-panel';
import { PanelProps } from './editor-state';
import { RootPanel } from '../panels/root-panel';

const Panels = createContext({
  panels: [],
} as {
  panels: EditorPanel<PanelProps>[];
});

export const usePanels = () => {
  return useContext(Panels).panels;
};

export const PanelProvider: FC<{ children: ReactElement }> = ({ children }) => {
  return (
    <Panels.Provider value={{ panels: [RootPanel, ControlPanel, ImagePanel, DividerPanel] }}>
      {children}
    </Panels.Provider>
  );
};
