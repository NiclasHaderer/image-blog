import { ViewNode } from './view-node';
import { DIVIDER_NODE_ID, DividerNodeProps, NodeProps } from '@image-blog/shared';

export class DividerViewNode implements ViewNode<DividerNodeProps> {
  public id = DIVIDER_NODE_ID;

  public canHandle(type: NodeProps): boolean {
    return type.id === this.id;
  }

  public Render(type: DividerNodeProps, skipUnknownNodes = true): React.JSX.Element | string | null {
    return <hr className="my-2" />;
  }
}
