import { ViewNode } from './view-node';
import { DIVIDER_NODE_ID, DividerNodeProps, NodeProps } from '@image-blog/common';

export const DividerViewNode: ViewNode<DividerNodeProps> = {
  canHandle(type: NodeProps): boolean {
    return type.id === DIVIDER_NODE_ID;
  },
  Render(type: DividerNodeProps): React.JSX.Element | string | null {
    return <hr />;
  },
};
