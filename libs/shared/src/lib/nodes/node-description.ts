import { NodeCapabilities } from '../node-capabilities';
import { NodeProps } from '../node-props';

export interface NodeDescription<T extends NodeProps<any>> {
  id: string;
  capabilities: NodeCapabilities;
  empty: () => T;
}

export type NodeDescriptions = NodeDescription<NodeProps<any>>[];
