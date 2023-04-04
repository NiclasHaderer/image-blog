export interface TypedStructure {
  type: string;
  onUpdate?: <V extends TypedStructure>(newState: V) => void;
  onCreate?: <V extends TypedStructure>(newState: V) => void;
  onDelete?: () => void;
}

export interface EditorPanel<T extends TypedStructure> {
  name: string;
  Render: <V extends T>(props: V) => JSX.Element | null;
  Edit: <V extends T>(props: V) => JSX.Element | null;
  Icon: (props: { size: number | string }) => JSX.Element | null;

  canHandle(type: TypedStructure): type is T;

  empty(): T;
}
