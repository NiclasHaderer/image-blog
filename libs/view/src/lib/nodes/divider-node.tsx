import { ViewNode } from './view-node';
import { DIVIDER_NODE_ID, DividerNodeProps, NodeProps } from '@image-blog/shared';

export const DividerViewNode: ViewNode<DividerNodeProps> = {
  id: DIVIDER_NODE_ID,
  canHandle(type: NodeProps): boolean {
    return type.id === this.id;
  },
  Render(type: DividerNodeProps, skipUnknownNodes = true): React.JSX.Element | string | null {
    return <hr className="my-2" />;
  },
};
