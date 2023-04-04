import { EditorPanel, PanelState, TypedStructure } from './editor-panel';
import { DividerIcon } from '../icons';

export interface DividerPanelData extends TypedStructure {
  type: 'divider';
}

export type DividerPanelState = PanelState;

export const DividerPanel: EditorPanel<DividerPanelData, DividerPanelState> = {
  name: 'Divider',
  Icon: ({ size }) => <DividerIcon style={{ width: size, height: size }} />,
  Edit: () => {
    return <hr />;
  },
  Render: () => {
    return <hr />;
  },
  canHandle: (node): node is DividerPanelData => node.type === 'divider',
  empty(): DividerPanelData {
    return {
      type: 'divider',
    };
  },
};
