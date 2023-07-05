import { NodeProps } from '../node-props';
import { NodeDescription } from './node-description';

export interface ColumnNodeProps
  extends NodeProps<{
    lWidth: string;
  }> {
  children: [NodeProps, NodeProps];
}

export const ColumnNodeDescription: NodeDescription<ColumnNodeProps> = {
  id: 'column',
  capabilities: {
    canBeDeleted: true,
    canHaveChildren: true,
    immutableChildren: true,
    canBeInnerFocused: false,
    structural: false,
  },
  empty() {
    return {
      id: this.id,
      children: [ColumnNodeOutletDescription.empty(), ColumnNodeOutletDescription.empty()],
      data: {
        lWidth: '50%',
      },
      capabilities: {
        canBeDeleted: true,
        canHaveChildren: true,
        immutableChildren: true,
        canBeInnerFocused: false,
        structural: false,
      },
    };
  },
};

export type ColumnNodeOutletProps = NodeProps;

export const ColumnNodeOutletDescription: NodeDescription<ColumnNodeOutletProps> = {
  id: 'column-outlet',
  capabilities: {
    canBeDeleted: false,
    canBeInnerFocused: false,
    immutableChildren: false,
    canHaveChildren: true,
    minChildren: 1,
    maxChildren: Infinity,
    structural: true,
  },
  empty() {
    return {
      id: this.id,
      children: [ColumnNodeDescription.empty(), ColumnNodeDescription.empty()],
      data: {
        lWidth: '50%',
      },
    };
  },
};
