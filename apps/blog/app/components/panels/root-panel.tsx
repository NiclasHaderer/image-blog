import { EditorPanel } from '../state/editor-panel';
import { PanelProps } from '../state/editor-state';

type RootPanelProps = PanelProps<undefined>;

export const RootPanel: EditorPanel<RootPanelProps> = {
  name: 'root',
  capabilities: {
    canHaveChildren: true,
    canBeDragged: false,
    canBeDeleted: false,
    canBeInnerFocused: false,
  },
  empty(): RootPanelProps {
    return {
      data: undefined,
      ethereal: {
        focused: false,
        outerFocused: false,
      },
      children: [],
      name: this.name,
    };
  },
  Icon(props: { size: number | string }): JSX.Element | null {
    return null;
  },
  Edit<V>(props: V): JSX.Element | null {
    return <></>;
  },
  View<V>(props: V): JSX.Element | null {
    return <></>;
  },
  canHandle(type: RootPanelProps): boolean {
    return type.name === this.name;
  },
};
