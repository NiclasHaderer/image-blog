import { EditorPanel } from '../state/editor-panel';
import { DividerIcon } from '../common/icons';
import { PanelProps } from '../state/editor-state';

export type DividerPanelProps = PanelProps<undefined>;

export const DividerPanel: EditorPanel<DividerPanelProps> = {
  name: 'Divider',
  capabilities: {
    canBeInnerFocused: false,
    canBeDragged: true,
    canHaveChildren: false,
    canBeDeleted: true,
  },
  Icon: ({ size }) => <DividerIcon style={{ width: size, height: size }} />,
  Edit: (_) => {
    return <hr />;
  },
  View(_) {
    return this.Edit(_);
  },
  canHandle(node) {
    return node.name === this.name;
  },
  empty(): DividerPanelProps {
    return {
      name: this.name,
      data: undefined,
      ethereal: {
        focused: false,
        outerFocused: false,
      },
    };
  },
};
