import { ViewNode } from './view-node';
import { DividerNodeDescription, DividerNodeProps } from '@image-blog/shared';

export class DividerViewNode extends ViewNode<DividerNodeProps> {
  public constructor() {
    super(DividerNodeDescription);
  }

  public Render(type: DividerNodeProps, skipUnknownNodes = true): React.JSX.Element | string | null {
    return <hr className="my-2" />;
  }
}
