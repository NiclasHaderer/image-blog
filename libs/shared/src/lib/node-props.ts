export interface NodeProps<T = any> {
  id: string;
  children?: NodeProps[];
  data: T;
}

export interface RootNodeProps extends NodeProps {
  focusedNode: number[] | null;
  forceFocus: boolean;
  outerFocusedNode: number[] | null;
  outerFocusedRange: number | null;
}
