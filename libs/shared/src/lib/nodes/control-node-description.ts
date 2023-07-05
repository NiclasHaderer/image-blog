import { NodeProps } from '../node-props';
import { NodeDescription } from './node-description';

export type ControlNodeProps = NodeProps;

export const ControlNodeDescription: NodeDescription<ControlNodeProps> = {
  id: 'control',
  capabilities: {
    canBeDeleted: true,
    canBeInnerFocused: true,
    canHaveChildren: false,
    structural: false,
  },
  empty() {
    return {
      id: this.id,
      children: [],
      data: undefined,
    };
  },
};
