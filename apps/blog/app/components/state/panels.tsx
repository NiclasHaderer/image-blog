import { createContext, FC, ReactElement, useContext } from 'react';
import { EditorPanel } from './editor-panel';
import { ControlPanel } from '../panels/control-panel';
import { ImagePanel } from '../panels/image-panel';
import { DividerPanel } from '../panels/divider-panel';
import { PanelProps } from './editor-state';
import { ColumnPanel, ColumnPanelOutlet } from '../panels/column-panel';

const Panels = createContext({
  panels: [],
} as {
  panels: EditorPanel<PanelProps>[];
});

export const usePanels = () => {
  return useContext(Panels).panels;
};

export const usePanelQuery = (query: string) => {
  return usePanels()
    .map((p) => [p, p.distance(query)] as [EditorPanel<PanelProps>, number])
    .filter(([, distance]) => distance > -Infinity)
    .sort(([, a], [, b]) => a - b)
    .map(([p]) => p);
};

export const PanelProvider: FC<{ children: ReactElement }> = ({ children }) => {
  return (
    <Panels.Provider value={{ panels: [ControlPanel, ImagePanel, DividerPanel, ColumnPanel, ColumnPanelOutlet] }}>
      {children}
    </Panels.Provider>
  );
};
