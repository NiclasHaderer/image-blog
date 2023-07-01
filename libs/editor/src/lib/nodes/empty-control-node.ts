import { ControlNodeProps } from '@image-blog/common';

export const EMPTY_CONTROL_NODE: ControlNodeProps = {
  id: 'control',
  data: undefined,
  capabilities: {
    canBeDeleted: true,
    canBeInnerFocused: true,
    canHaveChildren: false,
    structural: false,
  },
};
