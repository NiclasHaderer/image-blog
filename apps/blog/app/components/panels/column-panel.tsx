import { EditorPanel } from '../state/editor-panel';
import { EditorChild, EditorChildren, PanelProps, usePanelIndex } from '../state/editor-state';
import { ControlPanel } from './control-panel';
import { ColumnIcon } from '../common/icons';
import * as fuzzysort from 'fuzzysort';

type PanelData = {
  lWidth: string;
};

interface ColumnPanelProps extends PanelProps<PanelData> {
  children: [PanelProps, PanelProps];
}

type ColumnPanelOutletProps = PanelProps;

export const ColumnPanelOutlet: EditorPanel<ColumnPanelOutletProps> = {
  id: 'column-panel-outlet',
  capabilities: {
    canBeDeleted: false,
    canBeMoved: false,
    canBeInnerFocused: false,
    noControls: true,
    standalone: false,
  },
  Render(props: ColumnPanelOutletProps): JSX.Element | null {
    return <EditorChildren>{props}</EditorChildren>;
  },
  Name: () => null,
  distance: () => -Infinity,
  Icon: () => null,
  canHandle(type: PanelProps): boolean {
    return type.id === this.id;
  },
  empty(): ColumnPanelOutletProps {
    return {
      id: this.id,
      children: [ControlPanel.empty()],
      data: undefined,
    };
  },
};

export const ColumnPanel: EditorPanel<ColumnPanelProps> = {
  id: 'column-panel',
  capabilities: {
    canBeDeleted: true,
    canBeInnerFocused: true,
    canBeMoved: true,
    noControls: false,
    standalone: true,
  },
  Name: () => 'Column Panel',
  Icon: () => <ColumnIcon />,
  Render: (props) => {
    const index = usePanelIndex();
    return (
      <div className="flex">
        <div className="w-1/2">
          <EditorChild index={[...index, 0]}>{props.children[0]}</EditorChild>
        </div>
        <div className="w-1/2">
          <EditorChild index={[...index, 1]}>{props.children[1]}</EditorChild>
        </div>
      </div>
    );
  },
  distance(query: string): number {
    return fuzzysort.go(query, ['column', 'columns', 'two columns', 'two column panel'])[0]?.score ?? -Infinity;
  },
  empty(): ColumnPanelProps {
    return {
      id: this.id,
      children: [ColumnPanelOutlet.empty(), ColumnPanelOutlet.empty()],
      data: {
        lWidth: '50%',
      },
    };
  },
  canHandle(type: ColumnPanelProps): boolean {
    return type.id === this.id;
  },
};
