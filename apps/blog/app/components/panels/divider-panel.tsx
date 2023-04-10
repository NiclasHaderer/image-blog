import { EditorPanel } from '../state/editor-panel';
import { DividerIcon } from '../common/icons';
import { PanelProps } from '../state/editor-state';
import * as fuzzysort from 'fuzzysort';

export type DividerPanelProps = PanelProps<undefined>;

export const DividerPanel: EditorPanel<DividerPanelProps> = {
  id: 'divider',
  capabilities: {
    canBeInnerFocused: false,
    canBeMoved: true,
    canBeDeleted: true,
    noControls: false,
    standalone: true,
  },
  Name: () => 'Divider',
  Icon: ({ size }) => <DividerIcon style={{ width: size, height: size }} />,
  Render: (_) => <hr />,
  canHandle(node) {
    return node.id === this.id;
  },
  distance(query: string) {
    return (
      fuzzysort.go(query, ['divider', 'line', 'hr', 'horizontal rule', 'horizontal divider', 'horizontal line'])[0]
        ?.score ?? -Infinity
    );
  },
  empty(): DividerPanelProps {
    return {
      id: this.id,
      data: undefined,
    };
  },
};
