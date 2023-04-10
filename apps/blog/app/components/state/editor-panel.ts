import { PanelProps } from './editor-state';

export interface PanelCapabilities {
  canBeMoved: boolean;
  canBeDeleted: boolean;
  canBeInnerFocused: boolean;
  noControls: boolean;
  standalone: boolean;
}

export interface EditorPanel<T extends PanelProps> {
  readonly id: string;
  readonly capabilities: Readonly<PanelCapabilities>;

  Render<V extends T>(props: V): JSX.Element | null;

  Icon(props: { size: number | string }): JSX.Element | null;

  Name(): JSX.Element | string | null;

  canHandle(type: T): boolean;

  distance(query: string): number;

  empty(): T;
}
