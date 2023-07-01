export type NodeCapabilities =
  | {
      canBeDeleted: boolean;
      canHaveChildren: false;
      canBeInnerFocused: boolean;
      structural: boolean;
      immutableChildren?: false;
      minChildren?: undefined;
      maxChildren?: undefined;
    }
  | {
      canBeDeleted: boolean;
      canHaveChildren: true;
      canBeInnerFocused: boolean;
      structural: boolean;
      immutableChildren: true;
      minChildren?: undefined;
      maxChildren?: undefined;
    }
  | {
      // If the node has no element inside of it that can be focused
      canBeInnerFocused: boolean;
      // If the node should not appear in the view, but is only there to give the tree some structure.
      // This results in the node not being rendered and not being able to be focused.
      structural: boolean;
      // If the node can have children
      canHaveChildren: true;
      // If the node can be deleted or moved
      canBeDeleted: boolean;
      // If the node has a fixed number of children which cannot be changed
      immutableChildren: false;

      // The minimum number of children the node must have
      // If the node has fewer children than this, ControlNodes will be added until the minimum is reached
      minChildren: number;

      // The maximum number of children the node can have
      maxChildren: number;
    };
