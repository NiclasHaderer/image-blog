import { NodeProps } from '../node-props';
import { NodeDescription } from './node-description';
import { ControlNodeDescription } from './control-node-description';

export interface RootNodeProps extends NodeProps {
  focusedNode: number[] | null;
  forceFocus: boolean;
  outerFocusedNode: number[] | null;
  outerFocusedRange: number;
  children: NodeProps<any>[];
}

export const RootNodeDescription: NodeDescription<RootNodeProps> = {
  id: 'root',
  capabilities: {
    canBeDeleted: false,
    canHaveChildren: true,
    immutableChildren: false,
    canBeInnerFocused: false,
    structural: true,
    maxChildren: Infinity,
    minChildren: 1,
  },
  empty() {
    return {
      id: this.id,
      children: [ControlNodeDescription.empty()],
      data: undefined,
      focusedNode: [0],
      outerFocusedNode: null,
      outerFocusedRange: 0,
      forceFocus: true,
    };
  },
};
