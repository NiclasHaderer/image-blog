import { NodeProps } from '../node-props';
import { NodeDescription } from './node-description';

export type DividerNodeProps = NodeProps<undefined>;

export const DividerNodeDescription: NodeDescription<DividerNodeProps> = {
  id: 'divider',
  capabilities: {
    canBeDeleted: true,
    canHaveChildren: false,
    canBeInnerFocused: false,
    structural: false,
  },
  empty() {
    return {
      id: this.id,
      data: undefined,
    };
  },
};
