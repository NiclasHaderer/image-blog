import { NodeCapabilities } from './node-capabilities';

export interface NodeProps<T = any> {
  id: string;
  children?: NodeProps[];
  data: T;
  capabilities: NodeCapabilities;
}

export interface RootNodeProps extends NodeProps {
  focusedNode: number[] | null;
  forceFocus: boolean;
  outerFocusedNode: number[] | null;
  outerFocusedRange: number | null;
}
