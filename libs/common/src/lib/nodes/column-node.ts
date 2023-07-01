import { NodeProps } from '../node-props';

export interface ColumnNodeProps
  extends NodeProps<{
    lWidth: string;
  }> {
  children: [NodeProps, NodeProps];
}

export const COLUMN_NODE_ID = 'column';

export type ColumnNodeOutletProps = NodeProps;

export const COLUMN_OUTLET_ID = 'column-outlet';
