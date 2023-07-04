import { ControlNodeProps } from '@image-blog/shared';

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
