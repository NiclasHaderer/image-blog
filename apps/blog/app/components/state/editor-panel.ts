import { PanelProps } from './editor-state';
export interface PanelCapabilities {
  canHaveChildren: boolean;
  canBeDragged: boolean;
  canBeDeleted: boolean;
  canBeInnerFocused: boolean;
}

export interface EditorPanel<T extends PanelProps> {
  name: string;
  capabilities: PanelCapabilities;
  View: <V extends T>(props: V) => JSX.Element | null;
  Edit: <V extends T>(props: V) => JSX.Element | null;
  Icon: (props: { size: number | string }) => JSX.Element | null;

  canHandle(type: T): boolean;

  empty(): T;
}
