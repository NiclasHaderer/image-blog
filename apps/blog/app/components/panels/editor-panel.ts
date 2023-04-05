export interface TypedStructure {
  type: string;
}

export interface PanelState {
  onUpdate?: <V extends TypedStructure>(newState: V) => void;
  onCreate?: <V extends TypedStructure>(newState: V) => void;
  onDelete?: () => void;
  focus?: Readonly<{
    focused: boolean;
    force: boolean;
  }>;
  outerFocused: boolean;
}

export interface EditorPanel<T extends TypedStructure, S extends PanelState> {
  name: string;
  Render: <V extends T & S>(props: V) => JSX.Element | null;
  Edit: <V extends T & S>(props: V) => JSX.Element | null;
  Icon: (props: { size: number | string }) => JSX.Element | null;

  canHandle(type: TypedStructure): boolean;

  empty(): T;
}
