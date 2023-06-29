import type { ControlNodeProps } from './control-node';

export const EMPTY_CONTROL_NODE: ControlNodeProps = {
  id: 'control-node',
  data: undefined,
  capabilities: {
    canBeDeleted: true,
    canBeInnerFocused: true,
    canHaveChildren: false,
    structural: false,
  },
};
